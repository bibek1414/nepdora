export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  components: TemplateComponent[];
}

export interface TemplateComponent {
  type: string;
  order: number;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultData: any;
}
