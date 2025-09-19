// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Plus,
//   Trash2,
//   Loader2,
//   Type,
//   BarChart,
//   LayoutGrid,
//   ImageIcon,
//   Users,
//   Upload,
//   X,
// } from "lucide-react";
// import {
//   AboutUsData,
//   AboutUs1Data,
//   AboutUs2Data,
//   AboutUsStat,
//   AboutUs3Data,
//   TeamMember,
//   defaultAboutUs1Data,
//   defaultAboutUs2Data,
//   defaultAboutUs3Data,
// } from "@/types/owner-site/components/about";
// import { useUpdateAboutUsMutation } from "@/hooks/owner-site/components/use-about";
// import { uploadToCloudinary } from "@/utils/cloudinary";

// interface AboutUsSettingsDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   aboutUsData: AboutUsData;
//   componentId: string;
//   pageSlug: string;
// }

// // Image Upload Component
// const ImageUpload: React.FC<{
//   imageUrl: string;
//   onImageChange: (url: string) => void;
//   altText?: string;
//   label: string;
//   aspectRatio?: string;
// }> = ({ imageUrl, onImageChange, altText, label, aspectRatio = "4/3" }) => {
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       alert("Please select an image file");
//       return;
//     }

//     // Validate file size (5MB page_size)
//     if (file.size > 5 * 1024 * 1024) {
//       alert("File size must be less than 5MB");
//       return;
//     }

//     try {
//       setUploading(true);
//       const url = await uploadToCloudinary(file, {
//         folder: "about-us",
//         resourceType: "image",
//       });
//       onImageChange(url);
//     } catch (error) {
//       console.error("Upload failed:", error);
//       alert("Failed to upload image. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleUrlChange = (url: string) => {
//     onImageChange(url);
//   };

//   const removeImage = () => {
//     onImageChange("");
//   };

//   return (
//     <div className="space-y-4">
//       <Label>{label}</Label>

//       {/* Image Preview */}
//       {imageUrl && (
//         <div className="relative">
//           <img
//             src={imageUrl}
//             alt={altText || "Preview"}
//             className={`max-w-xs rounded-lg border object-cover`}
//             style={{ aspectRatio }}
//           />
//           <Button
//             variant="destructive"
//             size="icon"
//             className="absolute -top-2 -right-2 h-6 w-6"
//             onClick={removeImage}
//           >
//             <X className="h-3 w-3" />
//           </Button>
//         </div>
//       )}

//       {/* Upload Section */}
//       <div className="flex flex-col gap-3">
//         <div className="flex gap-2">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => fileInputRef.current?.click()}
//             disabled={uploading}
//             className="flex-1"
//           >
//             {uploading ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               <Upload className="mr-2 h-4 w-4" />
//             )}
//             {uploading ? "Uploading..." : "Upload Image"}
//           </Button>
//         </div>

//         <div className="text-muted-foreground text-center text-xs">or</div>

//         <div>
//           <Label className="text-xs">Image URL</Label>
//           <Input
//             value={imageUrl}
//             onChange={e => handleUrlChange(e.target.value)}
//             placeholder="Paste image URL here..."
//           />
//         </div>
//       </div>

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleFileSelect}
//         className="hidden"
//       />

//       <p className="text-muted-foreground text-xs">
//         Supported formats: JPG, PNG, WebP. Max size: 5MB
//       </p>
//     </div>
//   );
// };

// // Sub-component for editing Template 1
// const EditTemplate1: React.FC<{
//   data: AboutUs1Data;
//   setData: (d: AboutUs1Data) => void;
// }> = ({ data, setData }) => {
//   //eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleChange = (field: keyof AboutUs1Data, value: any) =>
//     setData({ ...data, [field]: value });
//   const handleStatUpdate = (id: string, updates: Partial<AboutUsStat>) => {
//     handleChange(
//       "stats",
//       data.stats.map(s => (s.id === id ? { ...s, ...updates } : s))
//     );
//   };
//   const addStat = () =>
//     handleChange("stats", [
//       ...data.stats,
//       { id: Date.now().toString(), value: "0", label: "New Stat" },
//     ]);
//   const removeStat = (id: string) =>
//     handleChange(
//       "stats",
//       data.stats.filter(s => s.id !== id)
//     );

//   return (
//     <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//       {/* Column 1: Content & Stats */}
//       <div className="space-y-6">
//         <div>
//           <h3 className="mb-4 flex items-center gap-2 font-semibold">
//             <Type className="h-4 w-4" />
//             Content
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <Label>Title</Label>
//               <Input
//                 value={data.title}
//                 onChange={e => handleChange("title", e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>Subtitle</Label>
//               <Input
//                 value={data.subtitle}
//                 onChange={e => handleChange("subtitle", e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>Description</Label>
//               <Textarea
//                 value={data.description}
//                 onChange={e => handleChange("description", e.target.value)}
//                 rows={5}
//               />
//             </div>
//           </div>
//         </div>
//         <div>
//           <h3 className="mb-4 flex items-center gap-2 font-semibold">
//             <BarChart className="h-4 w-4" />
//             Statistics
//           </h3>
//           <div className="max-h-60 space-y-3 overflow-y-auto p-1">
//             {data.stats.map(stat => (
//               <div
//                 key={stat.id}
//                 className="bg-muted/50 flex items-center gap-2 rounded-lg border p-2"
//               >
//                 <Input
//                   value={stat.value}
//                   onChange={e =>
//                     handleStatUpdate(stat.id, { value: e.target.value })
//                   }
//                   placeholder="Value"
//                 />
//                 <Input
//                   value={stat.label}
//                   onChange={e =>
//                     handleStatUpdate(stat.id, { label: e.target.value })
//                   }
//                   placeholder="Label"
//                 />
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => removeStat(stat.id)}
//                 >
//                   <Trash2 className="text-destructive h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={addStat}
//             className="mt-3"
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Add Stat
//           </Button>
//         </div>
//       </div>

//       {/* Column 2: Layout & Image */}
//       <div className="space-y-6">
//         <div>
//           <h3 className="mb-4 flex items-center gap-2 font-semibold">
//             <LayoutGrid className="h-4 w-4" />
//             Layout
//           </h3>
//           <Select
//             value={data.layout}
//             onValueChange={(v: "image-left" | "image-right") =>
//               handleChange("layout", v)
//             }
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="image-left">Image Left</SelectItem>
//               <SelectItem value="image-right">Image Right</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div>
//           <h3 className="mb-4 flex items-center gap-2 font-semibold">
//             <ImageIcon className="h-4 w-4" />
//             Main Image
//           </h3>
//           <div className="space-y-4">
//             <ImageUpload
//               imageUrl={data.imageUrl}
//               onImageChange={url => handleChange("imageUrl", url)}
//               altText={data.imageAlt}
//               label="Upload or paste image URL"
//               aspectRatio="4/3"
//             />
//             <div>
//               <Label>Image Alt Text</Label>
//               <Input
//                 value={data.imageAlt}
//                 onChange={e => handleChange("imageAlt", e.target.value)}
//                 placeholder="Describe the image for accessibility..."
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Sub-component for editing Template 2
// const EditTemplate2: React.FC<{
//   data: AboutUs2Data;
//   setData: (d: AboutUs2Data) => void;
// }> = ({ data, setData }) => {
//   //eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleChange = (field: keyof AboutUs2Data, value: any) =>
//     setData({ ...data, [field]: value });
//   const handleMemberUpdate = (id: string, updates: Partial<TeamMember>) => {
//     handleChange(
//       "teamMembers",
//       data.teamMembers.map(m => (m.id === id ? { ...m, ...updates } : m))
//     );
//   };
//   const addMember = () =>
//     handleChange("teamMembers", [
//       ...data.teamMembers,
//       {
//         id: Date.now().toString(),
//         name: "New Member",
//         role: "Role",
//         imageUrl: "",
//       },
//     ]);
//   const removeMember = (id: string) =>
//     handleChange(
//       "teamMembers",
//       data.teamMembers.filter(m => m.id !== id)
//     );

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="mb-4 flex items-center gap-2 font-semibold">
//           <Type className="h-4 w-4" />
//           Content
//         </h3>
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <div>
//             <Label>Title</Label>
//             <Input
//               value={data.title}
//               onChange={e => handleChange("title", e.target.value)}
//             />
//           </div>
//           <div>
//             <Label>Subtitle</Label>
//             <Input
//               value={data.subtitle}
//               onChange={e => handleChange("subtitle", e.target.value)}
//             />
//           </div>
//           <div className="md:col-span-2">
//             <Label>Description</Label>
//             <Textarea
//               value={data.description}
//               onChange={e => handleChange("description", e.target.value)}
//               rows={3}
//             />
//           </div>
//         </div>
//       </div>

//       <div>
//         <div className="mb-4 flex items-center justify-between">
//           <h3 className="flex items-center gap-2 font-semibold">
//             <Users className="h-4 w-4" />
//             Team Members
//           </h3>
//           <Button variant="outline" size="sm" onClick={addMember}>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Member
//           </Button>
//         </div>
//         <div className="max-h-96 space-y-4 overflow-y-auto p-2">
//           {data.teamMembers.map(member => (
//             <div
//               key={member.id}
//               className="bg-muted/50 space-y-3 rounded-lg border p-3"
//             >
//               <div className="flex justify-end">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => removeMember(member.id)}
//                 >
//                   <Trash2 className="text-destructive h-4 w-4" />
//                 </Button>
//               </div>

//               <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                 <div>
//                   <Label>Name</Label>
//                   <Input
//                     value={member.name}
//                     onChange={e =>
//                       handleMemberUpdate(member.id, { name: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <Label>Role</Label>
//                   <Input
//                     value={member.role}
//                     onChange={e =>
//                       handleMemberUpdate(member.id, { role: e.target.value })
//                     }
//                   />
//                 </div>

//                 {/* Bio field */}
//                 <div className="md:col-span-2">
//                   <Label>Bio (Optional)</Label>
//                   <Textarea
//                     value={member.bio || ""}
//                     onChange={e =>
//                       handleMemberUpdate(member.id, { bio: e.target.value })
//                     }
//                     rows={2}
//                     placeholder="Brief description about this team member..."
//                   />
//                 </div>

//                 {/* Image Upload */}
//                 <div className="md:col-span-2">
//                   <ImageUpload
//                     imageUrl={member.imageUrl}
//                     onImageChange={url =>
//                       handleMemberUpdate(member.id, { imageUrl: url })
//                     }
//                     altText={member.name}
//                     label="Team Member Photo"
//                     aspectRatio="1/1"
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const EditTemplate3: React.FC<{
//   data: AboutUs3Data;
//   setData: (d: AboutUs3Data) => void;
// }> = ({ data, setData }) => {
//   //eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleChange = (field: keyof AboutUs3Data, value: any) =>
//     setData({ ...data, [field]: value });

//   const handleFeatureUpdate = (
//     id: string,
//     updates: Partial<{ text: string }>
//   ) => {
//     handleChange(
//       "features",
//       data.features.map(f => (f.id === id ? { ...f, ...updates } : f))
//     );
//   };

//   const addFeature = () =>
//     handleChange("features", [
//       ...data.features,
//       { id: Date.now().toString(), text: "New Feature" },
//     ]);

//   const removeFeature = (id: string) =>
//     handleChange(
//       "features",
//       data.features.filter(f => f.id !== id)
//     );

//   const handleStatsChange = (
//     field: keyof AboutUs3Data["stats"],
//     value: string
//   ) => {
//     handleChange("stats", { ...data.stats, [field]: value });
//   };

//   return (
//     <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//       {/* Column 1: Content & Features */}
//       <div className="space-y-6">
//         <div>
//           <h3 className="mb-4 flex items-center gap-2 font-semibold">
//             <Type className="h-4 w-4" />
//             Content
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <Label>Title</Label>
//               <Input
//                 value={data.title}
//                 onChange={e => handleChange("title", e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>Subtitle</Label>
//               <Input
//                 value={data.subtitle}
//                 onChange={e => handleChange("subtitle", e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>Description</Label>
//               <Textarea
//                 value={data.description}
//                 onChange={e => handleChange("description", e.target.value)}
//                 rows={5}
//               />
//             </div>
//           </div>
//         </div>

//         <div>
//           <h3 className="mb-4 flex items-center gap-2 font-semibold">
//             <BarChart className="h-4 w-4" />
//             Features
//           </h3>
//           <div className="max-h-60 space-y-3 overflow-y-auto p-1">
//             {data.features.map(feature => (
//               <div
//                 key={feature.id}
//                 className="bg-muted/50 flex items-center gap-2 rounded-lg border p-2"
//               >
//                 <Input
//                   value={feature.text}
//                   onChange={e =>
//                     handleFeatureUpdate(feature.id, { text: e.target.value })
//                   }
//                   placeholder="Feature text"
//                   className="flex-1"
//                 />
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => removeFeature(feature.id)}
//                 >
//                   <Trash2 className="text-destructive h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={addFeature}
//             className="mt-3"
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Add Feature
//           </Button>
//         </div>
//       </div>

//       {/* Column 2: Stats */}
//       <div className="space-y-6">
//         <div>
//           <h3 className="mb-4 flex items-center gap-2 font-semibold">
//             <LayoutGrid className="h-4 w-4" />
//             Timeline & Stats
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <Label>Start Year</Label>
//               <Input
//                 value={data.stats.startYear}
//                 onChange={e => handleStatsChange("startYear", e.target.value)}
//                 placeholder="e.g., 2024"
//               />
//             </div>
//             <div>
//               <Label>Completion Year</Label>
//               <Input
//                 value={data.stats.completeYear}
//                 onChange={e =>
//                   handleStatsChange("completeYear", e.target.value)
//                 }
//                 placeholder="e.g., 2026"
//               />
//             </div>
//             <div>
//               <Label>Units Available</Label>
//               <Input
//                 value={data.stats.unitsAvailable}
//                 onChange={e =>
//                   handleStatsChange("unitsAvailable", e.target.value)
//                 }
//                 placeholder="e.g., 50+ UNITS"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const AboutUsSettingsDialog: React.FC<AboutUsSettingsDialogProps> = ({
//   isOpen,
//   onOpenChange,
//   aboutUsData,
//   componentId,
//   pageSlug,
// }) => {
//   const [localData, setLocalData] = useState<AboutUsData>(aboutUsData);
//   const updateMutation = useUpdateAboutUsMutation(pageSlug, componentId);

//   useEffect(() => setLocalData(aboutUsData), [aboutUsData, isOpen]);

//   const handleTemplateChange = (
//     template: "about-1" | "about-2" | "about-3"
//   ) => {
//     if (template === "about-1") setLocalData(defaultAboutUs1Data);
//     else if (template === "about-2") setLocalData(defaultAboutUs2Data);
//     else if (template === "about-3") setLocalData(defaultAboutUs3Data);
//   };

//   const handleSaveChanges = () => {
//     updateMutation.mutate(
//       { data: localData },
//       {
//         onSuccess: () => onOpenChange(false),
//       }
//     );
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
//         <DialogHeader>
//           <DialogTitle>Edit About Us Section</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 py-4">
//           <div>
//             <Label>Template</Label>
//             <Select
//               value={localData.template}
//               onValueChange={handleTemplateChange}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="about-1">Split Layout with Stats</SelectItem>
//                 <SelectItem value="about-2">Team Showcase</SelectItem>
//                 <SelectItem value="about-3">Luxury Modern</SelectItem>
//               </SelectContent>
//             </Select>
//             <p className="text-muted-foreground mt-1 text-xs">
//               Warning: Changing the template will reset the content for this
//               section.
//             </p>
//           </div>

//           <div className="border-t pt-6">
//             {localData.template === "about-1" && (
//               <EditTemplate1 data={localData} setData={d => setLocalData(d)} />
//             )}
//             {localData.template === "about-2" && (
//               <EditTemplate2 data={localData} setData={d => setLocalData(d)} />
//             )}
//             {localData.template === "about-3" && (
//               <EditTemplate3 data={localData} setData={d => setLocalData(d)} />
//             )}
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSaveChanges}
//             disabled={updateMutation.isPending}
//           >
//             {updateMutation.isPending && (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             )}
//             Save Changes
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
