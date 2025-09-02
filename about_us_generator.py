#!/usr/bin/env python3
"""
About Us Section Generator for Next.js Website Builder
Automatically generates TypeScript components and types based on user prompts
"""

import os
import re
import json
import uuid
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional

class AboutUsGenerator:
    def __init__(self, api_key: str, project_root: str):
        self.api_key = api_key
        self.project_root = project_root
        self.gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        
    def generate_component_id(self) -> str:
        """Generate unique component identifier"""
        return f"about-{uuid.uuid4().hex[:8]}"
    
    def call_gemini_api(self, prompt: str) -> Dict[str, Any]:
        """Call Google Gemini API to analyze prompt and generate component structure"""
        
        system_prompt = """
        You are a TypeScript component generator for a Next.js website builder. 
        Analyze the user's prompt and generate a structured response for an About Us section.
        
        Based on the prompt, determine:
        1. Component name (unique identifier like 'about-modern-team', 'about-stats-focus', etc.)
        2. Required fields and their types
        3. Default data structure
        4. Component layout description
        
        Respond with a JSON structure containing:
        {
            "componentName": "about-modern-team",
            "displayName": "Modern Team Layout",
            "description": "A modern about us section with team focus",
            "fields": [
                {"name": "title", "type": "string", "required": true, "default": "About Us"},
                {"name": "subtitle", "type": "string", "required": false},
                {"name": "description", "type": "string", "required": true},
                {"name": "imageUrl", "type": "string", "required": false},
                {"name": "teamMembers", "type": "TeamMember[]", "required": false},
                {"name": "stats", "type": "AboutUsStat[]", "required": false}
            ],
            "layoutType": "split-layout" | "full-width" | "card-grid" | "minimal",
            "hasImage": true/false,
            "hasStats": true/false,
            "hasTeamMembers": true/false,
            "customFeatures": ["feature1", "feature2"]
        }
        
        Only return valid JSON, no markdown or explanations.
        """
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": f"{system_prompt}\n\nUser prompt: {prompt}"
                        }
                    ]
                }
            ]
        }
        
        headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': self.api_key
        }
        
        try:
            response = requests.post(self.gemini_url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            content = result['candidates'][0]['content']['parts'][0]['text']
            
            # Clean and parse JSON response
            content = content.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            
            return json.loads(content)
            
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            return self._get_fallback_structure(prompt)
    
    def _get_fallback_structure(self, prompt: str) -> Dict[str, Any]:
        """Fallback structure if API fails"""
        return {
            "componentName": f"about-custom-{uuid.uuid4().hex[:6]}",
            "displayName": "Custom About Us",
            "description": "Custom about us section based on user prompt",
            "fields": [
                {"name": "title", "type": "string", "required": True, "default": "About Us"},
                {"name": "subtitle", "type": "string", "required": False, "default": ""},
                {"name": "description", "type": "string", "required": True, "default": ""},
                {"name": "imageUrl", "type": "string", "required": False, "default": ""}
            ],
            "layoutType": "split-layout",
            "hasImage": True,
            "hasStats": False,
            "hasTeamMembers": False,
            "customFeatures": []
        }
    
    def generate_typescript_interface(self, component_data: Dict[str, Any]) -> str:
        """Generate TypeScript interface based on component data"""
        
        component_name = component_data["componentName"].replace("-", "").title()
        interface_name = f"{component_name}Data"
        
        # Build interface fields
        fields = []
        fields.append(f'  template: "{component_data["componentName"]}";')
        
        for field in component_data["fields"]:
            field_type = field["type"]
            optional = "" if field["required"] else "?"
            fields.append(f"  {field['name']}{optional}: {field_type};")
        
        interface_code = f"""export interface {interface_name} {{
{chr(10).join(fields)}
}}"""
        
        # Generate default data
        default_values = []
        default_values.append(f'  template: "{component_data["componentName"]}",')
        
        for field in component_data["fields"]:
            if "default" in field and field["default"]:
                if field["type"] == "string":
                    default_values.append(f'  {field["name"]}: "{field["default"]}",')
                else:
                    default_values.append(f'  {field["name"]}: {field["default"]},')
        
        default_data_code = f"""export const default{component_name}Data: {interface_name} = {{
{chr(10).join(default_values)}
}};"""
        
        return f"{interface_code}\n\n{default_data_code}"
    
    def generate_react_component(self, component_data: Dict[str, Any]) -> str:
        """Generate React component based on structure"""
        
        component_name = component_data["componentName"].replace("-", "").title()
        template_name = f"{component_name}Template"
        interface_name = f"{component_name}Data"
        
        # Generate component structure based on layout type
        if component_data["layoutType"] == "split-layout":
            layout_jsx = self._generate_split_layout(component_data)
        elif component_data["layoutType"] == "card-grid":
            layout_jsx = self._generate_card_grid_layout(component_data)
        elif component_data["layoutType"] == "minimal":
            layout_jsx = self._generate_minimal_layout(component_data)
        else:
            layout_jsx = self._generate_default_layout(component_data)
        
        component_code = f'''
"use client";
import React, {{ useState }} from "react";
import {{ {interface_name} }} from "@/types/owner-site/components/about";
import {{ EditableText }} from "@/components/ui/editable-text";
{('import { EditableImage } from "@/components/ui/editable-image";' if component_data["hasImage"] else "")}

interface {template_name}Props {{
  aboutUsData: {interface_name};
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<{interface_name}>) => void;
}}

export function {template_name}({{
  aboutUsData,
  isEditable = false,
  onUpdate,
}}: {template_name}Props) {{
  const [data, setData] = useState(aboutUsData);

  // Handle text field updates
  const handleTextUpdate = (field: keyof {interface_name}) => (value: string) => {{
    const updatedData = {{ ...data, [field]: value }};
    setData(updatedData);
    onUpdate?.({{ [field]: value }} as Partial<{interface_name}>);
  }};

{self._generate_image_handlers(component_data) if component_data["hasImage"] else ""}

  return (
    {layout_jsx}
  );
}}
'''
        
        return component_code.strip()
    
    def _generate_split_layout(self, component_data: Dict[str, Any]) -> str:
        """Generate split layout JSX"""
        return '''<section className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
          {/* Content Section */}
          <div>
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h2"
              className="text-foreground mb-3 text-3xl font-bold md:text-4xl"
              isEditable={isEditable}
              placeholder="Enter main title..."
            />

            <EditableText
              value={data.subtitle}
              onChange={handleTextUpdate("subtitle")}
              as="p"
              className="text-primary mb-4 text-lg font-semibold"
              isEditable={isEditable}
              placeholder="Enter subtitle..."
            />

            <EditableText
              value={data.description}
              onChange={handleTextUpdate("description")}
              as="p"
              className="text-muted-foreground leading-relaxed"
              isEditable={isEditable}
              placeholder="Enter description..."
              multiline={true}
            />
          </div>

          {/* Image Section */}
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg ">
              <EditableImage
                src={data.imageUrl}
                alt={data.imageAlt || data.title}
                onImageChange={handleImageUpdate}
                onAltChange={handleAltUpdate}
                isEditable={isEditable}
                className="h-full w-full object-cover"
                width={600}
                height={450}
                priority
                cloudinaryOptions={{
                  folder: "about-us-images",
                  resourceType: "image",
                }}
                showAltEditor={isEditable}
              />
            </div>
          </div>
        </div>
      </div>
    </section>'''
    
    def _generate_minimal_layout(self, component_data: Dict[str, Any]) -> str:
        """Generate minimal layout JSX"""
        return '''<section className="bg-background py-20">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <EditableText
          value={data.title}
          onChange={handleTextUpdate("title")}
          as="h2"
          className="text-foreground mb-6 text-4xl font-bold md:text-5xl"
          isEditable={isEditable}
          placeholder="Enter main title..."
        />

        <EditableText
          value={data.description}
          onChange={handleTextUpdate("description")}
          as="p"
          className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed"
          isEditable={isEditable}
          placeholder="Enter description..."
          multiline={true}
        />
      </div>
    </section>'''
    
    def _generate_card_grid_layout(self, component_data: Dict[str, Any]) -> str:
        """Generate card grid layout JSX"""
        return '''<section className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="text-foreground mb-4 text-3xl font-bold md:text-4xl"
            isEditable={isEditable}
            placeholder="Enter main title..."
          />

          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="p"
            className="text-muted-foreground mx-auto max-w-2xl text-lg"
            isEditable={isEditable}
            placeholder="Enter description..."
            multiline={true}
          />
        </div>
      </div>
    </section>'''
    
    def _generate_default_layout(self, component_data: Dict[str, Any]) -> str:
        """Generate default layout JSX"""
        return self._generate_split_layout(component_data)
    
    def _generate_image_handlers(self, component_data: Dict[str, Any]) -> str:
        """Generate image handler functions if component has images"""
        return '''
  // Handle image updates
  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      imageUrl,
      imageAlt: updatedData.imageAlt,
    });
  };

  // Handle alt text updates
  const handleAltUpdate = (altText: string) => {
    const updatedData = { ...data, imageAlt: altText };
    setData(updatedData);
    onUpdate?.({ imageAlt: altText });
  };'''
    
    def update_about_types_file(self, component_data: Dict[str, Any]) -> bool:
        """Update the about.ts types file with new interface"""
        
        types_file_path = os.path.join(
            self.project_root, 
            "src/types/owner-site/components/about.ts"
        )
        
        if not os.path.exists(types_file_path):
            print(f"Types file not found: {types_file_path}")
            return False
        
        try:
            with open(types_file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Generate new interface
            new_interface = self.generate_typescript_interface(component_data)
            component_name = component_data["componentName"].replace("-", "").title()
            template_name = component_data["componentName"]
            
            # Add new interface before the union type
            union_type_pattern = r'export type AboutUsData ='
            if re.search(union_type_pattern, content):
                # Add to existing union type - find the last | and add new one
                content = re.sub(
                    r'(export type AboutUsData =\s*(?:\|\s*\w+Data\s*)*)(;)',
                    f'\\1\n  | {component_name}Data\\2',
                    content
                )
                
                # Add new interface before union type
                union_index = content.find('export type AboutUsData =')
                content = content[:union_index] + new_interface + '\n\n' + content[union_index:]
            else:
                # Create new union type
                content += f"\n\n{new_interface}\n"
                content += f"\nexport type AboutUsData = {component_name}Data;\n"
            
            # Update all type references to include new template
            # Fix AboutUsStylesDialog interface
            content = re.sub(
                r'(onStyleSelect: \(\s*template: )([^)]+)(\) => void;)',
                lambda m: f'{m.group(1)}{m.group(2)} | "{template_name}"{m.group(3)}',
                content
            )
            
            # Update handleAboutUsTemplateSelect parameter type
            content = re.sub(
                r'(handleAboutUsTemplateSelect = \(\s*template: )([^)]+)(\) => \{)',
                lambda m: f'{m.group(1)}{m.group(2)} | "{template_name}"{m.group(3)}',
                content
            )
            
            with open(types_file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
            
        except Exception as e:
            print(f"Error updating types file: {e}")
            return False
    
    def create_component_file(self, component_data: Dict[str, Any]) -> bool:
        """Create new React component file"""
        
        component_name = component_data["componentName"]
        component_file_path = os.path.join(
            self.project_root,
            f"src/components/site-owners/about/{component_name}.tsx"
        )
        
        try:
            # Generate component code
            component_code = self.generate_react_component(component_data)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(component_file_path), exist_ok=True)
            
            with open(component_file_path, 'w', encoding='utf-8') as f:
                f.write(component_code)
            
            print(f"Created component file: {component_file_path}")
            return True
            
        except Exception as e:
            print(f"Error creating component file: {e}")
            return False
    
    def update_about_component_file(self, component_data: Dict[str, Any]) -> bool:
        """Update the main about-component.tsx file to include new template"""
        
        about_component_path = os.path.join(
            self.project_root,
            "src/components/site-owners/about/about-component.tsx"
        )
        
        if not os.path.exists(about_component_path):
            print(f"About component file not found: {about_component_path}")
            return False
        
        try:
            with open(about_component_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            component_name = component_data["componentName"]
            template_name = component_data["componentName"].replace("-", "").title() + "Template"
            interface_name = component_data["componentName"].replace("-", "").title() + "Data"
            
            # Add import
            import_line = f'import {{ {template_name} }} from "./{component_name}";'
            if import_line not in content:
                # Find the last import and add after it
                import_pattern = r'(import.*from.*;\n)'
                imports = re.findall(import_pattern, content)
                if imports:
                    last_import = imports[-1]
                    content = content.replace(last_import, f"{last_import}{import_line}\n")
            
            # Add to switch statement
            new_case = f'''      case "{component_data["componentName"]}":
        return (
          <{template_name}
            aboutUsData={{component.data as {interface_name}}}
            isEditable={{isEditable}}
            onUpdate={{handleUpdate}}
          />
        );'''
            
            # Insert before default case
            content = re.sub(
                r'(\s+default:)',
                f'{new_case}\n\\1',
                content
            )
            
            with open(about_component_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
            
        except Exception as e:
            print(f"Error updating about component file: {e}")
            return False
    
    def update_styles_dialog(self, component_data: Dict[str, Any]) -> bool:
        """Update about-styles-dialog.tsx to include new template"""
        
        dialog_path = os.path.join(
            self.project_root,
            "src/components/site-owners/about/about-styles-dialog.tsx"
        )
        
        if not os.path.exists(dialog_path):
            print(f"Styles dialog file not found: {dialog_path}")
            return False
        
        try:
            with open(dialog_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Update type definition
            new_template = component_data["componentName"]
            type_pattern = r'("about-[^"]+"\s*\|?\s*)+'
            
            if f'"{new_template}"' not in content:
                # Add to onStyleSelect type
                content = re.sub(
                    r'(onStyleSelect: \([^)]+: )([^)]+)(\) => void;)',
                    f'\\1\\2 | "{new_template}"\\3',
                    content
                )
                
                # Add to templates array
                new_template_obj = f'''    {{
      id: "{new_template}" as const,
      name: "{component_data["displayName"]}",
      preview: (
        <Image
          src="/images/site-owners/about/{new_template}.png"
          alt="{component_data["displayName"]}"
          width={{800}}
          height={{400}}
          className="rounded-md"
        />
      ),
    }},'''
                
                # Insert before the closing bracket of templates array
                content = re.sub(
                    r'(\s+)(\];)',
                    f'\\1{new_template_obj}\n\\1\\2',
                    content
                )
            
            with open(dialog_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
            
        except Exception as e:
            print(f"Error updating styles dialog: {e}")
            return False
    
    def update_builder_layout(self, component_data: Dict[str, Any]) -> bool:
        """Update builder-layout.tsx to handle new template"""
        
        builder_path = os.path.join(
            self.project_root,
            "src/components/site-owners/builder/builder-layout.tsx"
        )
        
        if not os.path.exists(builder_path):
            print(f"Builder layout file not found: {builder_path}")
            return False
        
        try:
            with open(builder_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_template = component_data["componentName"]
            default_data_name = f"default{component_data['componentName'].replace('-', '').title()}Data"
            
            # Add import for new default data
            import_pattern = r'(import\s*{[^}]*)(}\s*from\s*"@/types/owner-site/components/about";)'
            content = re.sub(
                import_pattern,
                f'\\1, {default_data_name}\\2',
                content
            )
            
            # Update handleAboutUsTemplateSelect function
            case_pattern = r'(case "about-4":\s*aboutUsData = defaultAboutUs4Data;\s*break;)'
            new_case = f'''      case "{new_template}":
        aboutUsData = {default_data_name};
        break;'''
            
            content = re.sub(
                case_pattern,
                f'\\1\n{new_case}',
                content
            )
            
            # Update type in function parameter
            content = re.sub(
                r'(template: )([^)]+)(\) => \{)',
                f'\\1\\2 | "{new_template}"\\3',
                content
            )
            
            with open(builder_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
            
        except Exception as e:
            print(f"Error updating builder layout: {e}")
            return False
    
    def generate_about_section(self, user_prompt: str) -> bool:
        """Main function to generate complete about section from user prompt"""
        
        print(f"Analyzing prompt: {user_prompt}")
        
        # Get component structure from AI
        component_data = self.call_gemini_api(user_prompt)
        
        print(f"Generated component: {component_data['componentName']}")
        print(f"Display name: {component_data['displayName']}")
        
        # Update files
        success_steps = []
        
        # 1. Update types file
        if self.update_about_types_file(component_data):
            success_steps.append("✓ Updated types file")
        else:
            print("✗ Failed to update types file")
            return False
        
        # 2. Create component file
        if self.create_component_file(component_data):
            success_steps.append("✓ Created component file")
        else:
            print("✗ Failed to create component file")
            return False
        
        # 3. Update about-component.tsx
        if self.update_about_component_file(component_data):
            success_steps.append("✓ Updated about component")
        else:
            print("✗ Failed to update about component")
            return False
        
        # 4. Update styles dialog
        if self.update_styles_dialog(component_data):
            success_steps.append("✓ Updated styles dialog")
        else:
            print("✗ Failed to update styles dialog")
            return False
        
        # 5. Update builder layout
        if self.update_builder_layout(component_data):
            success_steps.append("✓ Updated builder layout")
        else:
            print("✗ Failed to update builder layout")
            return False
        
        print("\nGeneration completed successfully!")
        for step in success_steps:
            print(step)
        
        print(f"\nNext steps:")
        print(f"1. Add preview image: /public/images/site-owners/about/{component_data['componentName']}.png")
        print(f"2. Test the new component in your builder")
        print(f"3. Adjust styling as needed")
        
        return True
def enhance_prompt(user_prompt: str) -> str:
    """Takes raw client input and makes it into a structured design prompt"""
    
    base_prompt = f"""
    Create a visually stunning 'About Us' section based on the client request:
    "{user_prompt}"

    The design should include:
    - A clean, professional layout
    - Modern typography with proper spacing
    - Sections for company story, mission/vision, and values
    - Optionally include stats, milestones, and team members
    - Use engaging visuals like background images or illustrations
    - Ensure responsiveness for desktop and mobile
    - Output in a well-structured React + Tailwind component
    """
    
    return base_prompt.strip()

def main():
    """Main execution function"""
    
    # Configuration
    API_KEY = "AIzaSyANr_dQdL7ypTjG_s_EacDViRPJ5WTgmmQ"  # Your provided API key
    PROJECT_ROOT = input("Enter your project root path (or press Enter for current directory): ").strip() or "."
    
    if not os.path.exists(PROJECT_ROOT):
        print(f"Error: Project root path does not exist: {PROJECT_ROOT}")
        return
    
    generator = AboutUsGenerator(API_KEY, PROJECT_ROOT)
    
    print("=== About Us Section Generator ===")
    print("This tool will generate a complete about-us component based on your prompt.")
    print("Example prompts:")
    print("- 'Create a modern about us with team photos and company stats'")
    print("- 'Make a minimal about section with just text and a background image'")
    print("- 'Build an about us with timeline, achievements, and founder story'")
    print()
    
    while True:
        user_prompt = input("Enter your about-us section prompt (or 'quit' to exit): ").strip()
        
        if user_prompt.lower() in ['quit', 'exit', 'q']:
            print("Goodbye!")
            break
        
        if not user_prompt:
            print("Please enter a valid prompt.")
            continue
        
        try:
            # Enhance the client input
            final_prompt = enhance_prompt(user_prompt)
            
            # Pass enhanced prompt to your generator
            success = generator.generate_about_section(final_prompt)
            
            if success:
                print("\n🎉 About Us section generated successfully!")
                
                another = input("\nGenerate another component? (y/n): ").strip().lower()
                if another not in ['y', 'yes']:
                    break
            else:
                print("\n❌ Failed to generate component. Please try again.")
                
        except KeyboardInterrupt:
            print("\n\nOperation cancelled by user.")
            break
        except Exception as e:
            print(f"\n❌ An error occurred: {e}")
            continue


if __name__ == "__main__":
    main()