// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Switch } from "@/components/ui/switch";
// import { Upload, X, Image as ImageIcon } from "lucide-react";
// import { uploadToCloudinary } from "@/utils/cloudinary";

// interface LogoEditorDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (logoData: {
//     logoText: string;
//     logoImage?: string;
//     logoType: "text" | "image" | "both";
//     showCart: boolean;
//   }) => void;
//   initialData: {
//     logoText: string;
//     logoImage?: string;
//     logoType: "text" | "image" | "both";
//     showCart: boolean;
//   };
// }

// export const LogoEditorDialog: React.FC<LogoEditorDialogProps> = ({
//   isOpen,
//   onClose,
//   onSave,
//   initialData,
// }) => {
//   const [logoText, setLogoText] = useState(initialData.logoText);
//   const [logoImage, setLogoImage] = useState(initialData.logoImage || "");
//   const [logoType, setLogoType] = useState(initialData.logoType);
//   const [showCart, setShowCart] = useState(initialData.showCart);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Reset state when dialog opens or initial data changes
//   useEffect(() => {
//     if (isOpen) {
//       setLogoText(initialData.logoText);
//       setLogoImage(initialData.logoImage || "");
//       setLogoType(initialData.logoType);
//       setShowCart(initialData.showCart);
//       setUploadError(null);
//     }
//   }, [isOpen, initialData]);

//   const handleImageUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       setUploadError("Please select a valid image file");
//       return;
//     }

//     // Validate file size (2MB max)
//     if (file.size > 2 * 1024 * 1024) {
//       setUploadError("Image size must be less than 2MB");
//       return;
//     }

//     setIsUploading(true);
//     setUploadError(null);

//     try {
//       const imageUrl = await uploadToCloudinary(file, {
//         folder: "logos",
//         resourceType: "image",
//       });
//       setLogoImage(imageUrl);

//       // If no logo type is selected or it was text only, switch to image
//       if (logoType === "text") {
//         setLogoType("image");
//       }
//     } catch (error) {
//       setUploadError(error instanceof Error ? error.message : "Upload failed");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleRemoveImage = () => {
//     setLogoImage("");
//     if (logoType === "image") {
//       setLogoType("text");
//     } else if (logoType === "both") {
//       setLogoType("text");
//     }
//     // Reset file input
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleSave = () => {
//     // Validation
//     if (logoType === "text" && !logoText.trim()) {
//       setUploadError("Please enter logo text");
//       return;
//     }
//     if (logoType === "image" && !logoImage) {
//       setUploadError("Please upload a logo image");
//       return;
//     }
//     if (logoType === "both" && (!logoText.trim() || !logoImage)) {
//       setUploadError("Please provide both text and image for combined logo");
//       return;
//     }

//     onSave({
//       logoText: logoText.trim(),
//       logoImage: logoImage || undefined,
//       logoType,
//       showCart,
//     });
//     onClose();
//   };

//   const handleOpenChange = (open: boolean) => {
//     if (!open) {
//       onClose();
//     }
//   };

//   // Determine which logo types are available
//   const availableTypes = [
//     { value: "text" as const, label: "Text Only", disabled: false },
//     { value: "image" as const, label: "Image Only", disabled: !logoImage },
//     { value: "both" as const, label: "Text & Image", disabled: !logoImage },
//   ];

//   return (
//     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Edit Logo & Settings</DialogTitle>
//           <DialogDescription>
//             Customize your logo appearance and navigation settings
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Logo Text */}
//           <div className="space-y-2">
//             <Label htmlFor="logo-text">Logo Text</Label>
//             <Input
//               id="logo-text"
//               value={logoText}
//               onChange={e => setLogoText(e.target.value)}
//               placeholder="Enter your brand name"
//               disabled={logoType === "image"}
//             />
//           </div>

//           {/* Logo Image Upload */}
//           <div className="space-y-3">
//             <Label>Logo Image</Label>

//             {/* Upload Button */}
//             <div className="flex items-center gap-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => fileInputRef.current?.click()}
//                 disabled={isUploading}
//                 className="flex items-center gap-2"
//               >
//                 {isUploading ? (
//                   <>
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="h-4 w-4" />
//                     Upload Image
//                   </>
//                 )}
//               </Button>

//               {logoImage && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={handleRemoveImage}
//                   className="text-destructive hover:text-destructive"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>

//             {/* Hidden File Input */}
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="hidden"
//             />

//             {/* Image Preview */}
//             {logoImage && (
//               <div className="flex items-center gap-3 rounded-lg border p-3">
//                 <div className="h-12 w-12 overflow-hidden rounded-full border">
//                   <img
//                     src={logoImage}
//                     alt="Logo preview"
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">Logo uploaded</p>
//                   <p className="text-muted-foreground text-xs">Ready to use</p>
//                 </div>
//               </div>
//             )}

//             <p className="text-muted-foreground text-xs">
//               Recommended: Square image, max 2MB (JPG, PNG, WebP)
//             </p>
//           </div>

//           {/* Logo Type Selection */}
//           <div className="space-y-3">
//             <Label>Logo Display</Label>
//             <RadioGroup
//               value={logoType}
//               onValueChange={(value: "text" | "image" | "both") =>
//                 setLogoType(value)
//               }
//             >
//               {availableTypes.map(type => (
//                 <div key={type.value} className="flex items-center space-x-2">
//                   <RadioGroupItem
//                     value={type.value}
//                     id={type.value}
//                     disabled={type.disabled}
//                   />
//                   <Label
//                     htmlFor={type.value}
//                     className={type.disabled ? "opacity-50" : ""}
//                   >
//                     {type.label}
//                   </Label>
//                 </div>
//               ))}
//             </RadioGroup>
//           </div>

//           {/* Cart Settings */}
//           <div className="space-y-3">
//             <Label>Navigation Settings</Label>
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label className="text-sm font-normal">Show Cart Icon</Label>
//                 <p className="text-muted-foreground text-xs">
//                   Display shopping cart in navigation
//                 </p>
//               </div>
//               <Switch checked={showCart} onCheckedChange={setShowCart} />
//             </div>
//           </div>

//           {/* Error Message */}
//           {uploadError && (
//             <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-3">
//               <p className="text-destructive text-sm">{uploadError}</p>
//             </div>
//           )}
//         </div>

//         <DialogFooter>
//           <Button type="button" variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type="button" onClick={handleSave}>
//             Save Changes
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
