import React, { useState } from "react";
import { TeamComponentData } from "@/types/owner-site/components/team";
import Image from "next/image";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { TeamCard1 } from "./team-card-1";
import { TeamCard2 } from "./team-card-2";
import { TeamCard3 } from "./team-card-3";
import { TeamCard4 } from "./team-card-4";
import { TeamCard5 } from "./team-card-5";
import { TeamCard6 } from "./team-card-6";
import { TeamCard7 } from "./team-card-7";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertCircle,
  Trash2,
  Users,
  Plus,
  Map,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
} from "lucide-react";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import { TeamMemberDialog } from "../../admin/ourteam/our-team-form";
import { defaultTeamData } from "@/types/owner-site/components/team";

const CARD6_TITLE_FALLBACK =
  'Meet the Beautiful team behind <span class="text-indigo-500 italic">Optimo</span>';
const CARD6_SUBTITLE_FALLBACK = "[Team Member]";
interface TeamComponentProps {
  component: TeamComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: TeamComponentData) => void;
  onMemberClick?: (memberId: number, order: number) => void;
}

export const TeamComponent: React.FC<TeamComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onMemberClick,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null);

  const handleAddMember = () => {
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setDialogOpen(false);
  };

  const {
    page_size = 8,
    title: rawTitle,
    subtitle: rawSubtitle,
    style = "team-1",
  } = component.data || {};
  const title = rawTitle ?? "Meet Our Team";
  const subtitle = rawSubtitle;

  const isCard5Style = style === "team-5";
  const isCard6Style = style === "team-6";
  const isTeam7Style = style === "team-7";

  const shouldUseCard6TitleFallback =
    isCard6Style &&
    (rawTitle === undefined ||
      rawTitle === null ||
      rawTitle === defaultTeamData.title);
  const shouldUseCard6SubtitleFallback =
    isCard6Style &&
    (rawSubtitle === undefined ||
      rawSubtitle === null ||
      rawSubtitle === defaultTeamData.subtitle);

  const resolvedTitle = shouldUseCard6TitleFallback
    ? CARD6_TITLE_FALLBACK
    : title;
  const resolvedSubtitle = shouldUseCard6SubtitleFallback
    ? CARD6_SUBTITLE_FALLBACK
    : subtitle;
  const sectionClassName = isCard6Style
    ? "bg-white py-20"
    : "bg-background py-12 md:py-16";
  const liveContainerClassName = isCard6Style
    ? "container mx-auto px-4 md:px-8"
    : "container mx-auto max-w-7xl px-4";
  const builderContainerClassName = isCard6Style
    ? "container mx-auto px-4 md:px-8"
    : "container mx-auto px-4";
  const builderGridGapClass = isCard6Style ? "gap-8" : "gap-6";

  // Use unified mutation hooks
  const deleteTeamComponent = useDeleteComponentMutation(
    pageSlug || "",
    "team"
  );
  const updateTeamComponent = useUpdateComponentMutation(
    pageSlug || "",
    "team"
  );

  // Get team members
  const { data: members = [], isLoading, error } = useTeamMembers();
  const activeMember = members.find(m => m.id === activeMemberId) || members[0];

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const handleMemberClick = (member: TEAM) => {
    if (onMemberClick && component.order !== undefined) {
      onMemberClick(member.id, component.order);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }

    deleteTeamComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    updateTeamComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        title: newTitle,
      },
    });

    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: {
          ...component.data,
          title: newTitle,
        },
      });
    }
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    updateTeamComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        subtitle: newSubtitle,
      },
    });

    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      });
    }
  };

  const renderTeamCard = (member: TEAM) => {
    const cardProps = {
      member,
      onClick: () => handleMemberClick(member),
    };

    // Map old "team-X" styles to new style names for backward compatibility
    const styleMap: Record<string, string> = {
      "team-1": "grid-1",
      "team-2": "grid-2",
      "team-3": "list-1",
      "team-4": "card-4",
      "team-5": "card-5",
      "team-6": "card-6",
    };

    const styleKey = (styleMap[style as string] || style) as string;
    switch (styleKey) {
      case "grid-2":
        return <TeamCard2 key={member.id} {...cardProps} />;
      case "list-1":
        return <TeamCard3 key={member.id} {...cardProps} />;
      case "grid-1":
        return <TeamCard1 key={member.id} {...cardProps} />;
      case "card-4":
        return <TeamCard4 key={member.id} {...cardProps} />;
      case "card-5":
        return <TeamCard5 key={member.id} {...cardProps} />;
      case "card-6":
        return <TeamCard6 key={member.id} {...cardProps} />;
      default:
        return <TeamCard1 key={member.id} {...cardProps} />;
    }
  };

  const getGridClass = () => {
    // Map old "team-X" styles to new style names for backward compatibility
    const styleMap: Record<string, string> = {
      "team-1": "grid-1",
      "team-2": "grid-2",
      "team-3": "list-1",
      "team-4": "card-4",
      "team-5": "card-5",
      "team-6": "card-6",
    };

    const styleKey = (styleMap[style as string] || style) as string;
    switch (styleKey) {
      case "grid-2":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case "list-1":
        return "grid-cols-1 lg:grid-cols-2 gap-8";
      case "grid-1":
      case "card-4":
      case "card-5":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      case "card-6":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control */}
        <div className="absolute -right-5 z-30 flex translate-x-full opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              onClick={handleAddMember}
              className="bg-white text-gray-800 hover:bg-white hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Team Member
            </Button>

            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  onClick={handleDeleteClick}
                  variant="destructive"
                  size="sm"
                  className="h-8 px-3"
                  disabled={deleteTeamComponent.isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deleteTeamComponent.isPending ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <Trash2 className="text-destructive h-5 w-5" />
                    Delete Team Component
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this team component? This
                    action cannot be undone and will permanently remove the
                    component from your page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deleteTeamComponent.isPending}
                  >
                    {deleteTeamComponent.isPending
                      ? "Deleting..."
                      : "Delete Component"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <TeamMemberDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleDialogSuccess}
        />
        {/* Team Preview */}
        <div className="py-8">
          {isTeam7Style ? (
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
              {/* Background decoration lines */}
              <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden opacity-[0.03]">
                <svg width="100%" height="100%">
                  <circle
                    cx="0"
                    cy="50%"
                    r="40%"
                    stroke={theme.colors.primary}
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="0"
                    cy="50%"
                    r="50%"
                    stroke={theme.colors.primary}
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              <div className="container mx-auto grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                <div>
                  <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                    <Map size={14} />
                    <EditableText
                      value={subtitle || "OUR TEAM"}
                      onChange={handleSubtitleChange}
                      as="span"
                      isEditable={true}
                      placeholder="OUR TEAM"
                      style={{ fontFamily: theme.fonts.body }}
                    />
                  </div>
                  <EditableText
                    value={resolvedTitle}
                    onChange={handleTitleChange}
                    as="h2"
                    className="mb-12 text-4xl leading-tight font-bold md:text-5xl"
                    isEditable={true}
                    placeholder="Meet Our Team"
                  />

                  <div className="space-y-6">
                    {members.slice(0, 3).map(member => (
                      <TeamCard7
                        key={member.id}
                        member={member}
                        isActive={activeMember?.id === member.id}
                        onClick={() => setActiveMemberId(member.id)}
                      />
                    ))}
                    {members.length === 0 && (
                      <div className="text-gray-500">
                        No team members found. Add some!
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="relative h-[500px] w-full overflow-hidden rounded-[40px] bg-gray-200">
                    {activeMember ? (
                      <Image
                        src={activeMember.photo}
                        alt={activeMember.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No active member
                      </div>
                    )}

                    {/* Social Links overlay */}
                    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 rounded-full bg-white/90 px-6 py-2 backdrop-blur-sm">
                      {activeMember?.facebook && (
                        <a
                          href={activeMember.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 transition-colors hover:text-blue-600"
                        >
                          <Facebook size={18} />
                        </a>
                      )}
                      {activeMember?.instagram && (
                        <a
                          href={activeMember.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 transition-colors hover:text-pink-600"
                        >
                          <Instagram size={18} />
                        </a>
                      )}
                      {activeMember?.linkedin && (
                        <a
                          href={activeMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 transition-colors hover:text-blue-700"
                        >
                          <Linkedin size={18} />
                        </a>
                      )}
                      {activeMember?.twitter && (
                        <a
                          href={activeMember.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 transition-colors hover:text-black"
                        >
                          <Twitter size={18} />
                        </a>
                      )}
                      {activeMember?.email && (
                        <a
                          href={`mailto:${activeMember.email}`}
                          className="text-gray-700 transition-colors hover:text-red-500"
                        >
                          <Mail size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={builderContainerClassName}>
              <div
                className={`mb-8 text-center ${isCard5Style || isCard6Style ? "mb-16" : ""}`}
              >
                {isCard5Style ? (
                  <>
                    <EditableText
                      value={subtitle || "Team Members"}
                      onChange={handleSubtitleChange}
                      as="p"
                      className="mb-2 text-lg font-semibold text-blue-600"
                      isEditable={true}
                      placeholder="Enter subtitle..."
                    />
                    <EditableText
                      value={title}
                      onChange={handleTitleChange}
                      as="h1"
                      className="text-5xl font-bold text-[#001a4d]"
                      isEditable={true}
                      placeholder="Enter title..."
                    />
                  </>
                ) : isCard6Style ? (
                  <div className="flex flex-col items-center gap-6 text-center">
                    <EditableText
                      value={resolvedSubtitle || ""}
                      onChange={handleSubtitleChange}
                      as="p"
                      className="inline-flex w-auto items-center rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold tracking-[0.35em] text-slate-500 uppercase"
                      isEditable={true}
                      placeholder="[Team Member]"
                    />
                    <EditableText
                      value={resolvedTitle || ""}
                      onChange={handleTitleChange}
                      as="h2"
                      className="text-4xl leading-tight font-semibold text-slate-900 sm:text-5xl"
                      isEditable={true}
                      placeholder="Meet the Beautiful team behind Optimo"
                      multiline={true}
                    />
                  </div>
                ) : (
                  <>
                    <EditableText
                      value={resolvedTitle}
                      onChange={handleTitleChange}
                      as="h2"
                      className="text-foreground mb-2 text-3xl font-bold tracking-tight"
                      isEditable={true}
                      placeholder="Enter title..."
                    />
                    <EditableText
                      value={resolvedSubtitle || ""}
                      onChange={handleSubtitleChange}
                      as="p"
                      className="text-muted-foreground mx-auto max-w-2xl text-lg"
                      isEditable={true}
                      placeholder="Enter subtitle..."
                      multiline={true}
                    />
                  </>
                )}
              </div>

              {isLoading && (
                <div
                  className={`grid ${getGridClass()} ${builderGridGapClass}`}
                >
                  {Array.from({ length: Math.min(page_size, 8) }).map(
                    (_, index) => (
                      <div key={index} className="flex flex-col space-y-3">
                        <Skeleton className="h-[250px] w-full rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Loading Team</AlertTitle>
                  <AlertDescription>
                    {error instanceof Error
                      ? error.message
                      : "Failed to load team members. Please check your API connection."}
                  </AlertDescription>
                </Alert>
              )}

              {!isLoading && !error && members.length > 0 && (
                <div
                  className={`grid ${getGridClass()} ${builderGridGapClass}`}
                >
                  {members.map(member => (
                    <div
                      key={member.id}
                      className="relative transform cursor-default transition-transform duration-200 hover:scale-105"
                    >
                      <div className="absolute inset-0 z-10 bg-transparent" />
                      {renderTeamCard(member)}
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && !error && members.length === 0 && (
                <div className="bg-muted/50 rounded-lg py-12 text-center">
                  <Users className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    No Team Members Found
                  </h3>
                  <p className="text-muted-foreground">
                    Add team members to display them here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Live site rendering
  if (isTeam7Style) {
    return (
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-12">
        {/* Background decoration lines */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden opacity-[0.03]">
          <svg width="100%" height="100%">
            <circle
              cx="0"
              cy="50%"
              r="40%"
              stroke={theme.colors.primary}
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="0"
              cy="50%"
              r="50%"
              stroke={theme.colors.primary}
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="container mx-auto grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <div
              className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
              style={{ color: theme.colors.primary }}
            >
              <Map size={14} />
              <span
                dangerouslySetInnerHTML={{ __html: subtitle || "OUR TEAM" }}
                style={{ fontFamily: theme.fonts.body }}
              />
            </div>
            <h2
              className="mb-12 text-4xl leading-tight font-bold md:text-5xl"
              dangerouslySetInnerHTML={{ __html: resolvedTitle }}
              style={{
                fontFamily: theme.fonts.heading,
                color: theme.colors.text,
              }}
            />

            <div className="space-y-6">
              {members.slice(0, 3).map(member => (
                <TeamCard7
                  key={member.id}
                  member={member}
                  isActive={activeMember?.id === member.id}
                  onClick={() => setActiveMemberId(member.id)}
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[500px] w-full overflow-hidden rounded-[40px] bg-gray-200">
              {activeMember && (
                <Image
                  src={activeMember.photo}
                  alt={activeMember.name}
                  fill
                  className="object-cover"
                />
              )}

              {/* Social Links overlay */}
              <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 rounded-full bg-white/90 px-6 py-2 backdrop-blur-sm">
                {activeMember?.facebook && (
                  <a
                    href={activeMember.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 transition-colors hover:text-blue-600"
                  >
                    <Facebook size={18} />
                  </a>
                )}
                {activeMember?.instagram && (
                  <a
                    href={activeMember.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 transition-colors hover:text-pink-600"
                  >
                    <Instagram size={18} />
                  </a>
                )}
                {activeMember?.linkedin && (
                  <a
                    href={activeMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 transition-colors hover:text-blue-700"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {activeMember?.twitter && (
                  <a
                    href={activeMember.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 transition-colors hover:text-black"
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {activeMember?.email && (
                  <a
                    href={`mailto:${activeMember.email}`}
                    className="text-gray-700 transition-colors hover:text-red-500"
                  >
                    <Mail size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionClassName}>
      <div className={liveContainerClassName}>
        <div
          className={`mb-12 text-center ${isCard5Style || isCard6Style ? "mb-16" : ""}`}
        >
          {isCard5Style ? (
            <>
              {subtitle && (
                <p
                  className="mb-2 text-lg font-semibold text-blue-600"
                  dangerouslySetInnerHTML={{ __html: subtitle }}
                ></p>
              )}
              <h1
                className="text-5xl font-bold text-[#001a4d]"
                dangerouslySetInnerHTML={{ __html: resolvedTitle }}
              ></h1>
            </>
          ) : isCard6Style ? (
            <>
              {resolvedSubtitle && (
                <p
                  className="mx-auto mb-4 inline-flex rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold tracking-[0.35em] text-slate-500 uppercase"
                  dangerouslySetInnerHTML={{ __html: resolvedSubtitle }}
                ></p>
              )}
              <h2
                className="mx-auto max-w-3xl text-4xl leading-tight font-semibold text-slate-900 sm:text-5xl"
                dangerouslySetInnerHTML={{ __html: resolvedTitle || "" }}
              ></h2>
            </>
          ) : (
            <>
              <h2
                className="text-foreground mb-4 text-4xl font-bold tracking-tight"
                dangerouslySetInnerHTML={{ __html: resolvedTitle }}
              ></h2>
              {subtitle && (
                <p
                  className="text-muted-foreground mx-auto max-w-3xl text-xl"
                  dangerouslySetInnerHTML={{ __html: resolvedSubtitle || "" }}
                ></p>
              )}
            </>
          )}
        </div>

        {isLoading && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {Array.from({ length: page_size }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <Skeleton className="h-[280px] w-full rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mx-auto max-w-2xl">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Unable to Load Team</AlertTitle>
            <AlertDescription className="text-base">
              {error instanceof Error
                ? error.message
                : "We're having trouble loading our team. Please try refreshing the page."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && members.length > 0 && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {members.map(member => renderTeamCard(member))}
          </div>
        )}

        {!isLoading && !error && members.length === 0 && (
          <div className="py-16 text-center">
            <Users className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Team Members
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              Our team page is currently being updated. Please check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
