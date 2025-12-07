"use client";

import React, { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { AboutUs17Data } from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate17Props {
  aboutUsData: AboutUs17Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs17Data>) => void;
  siteUser?: string;
}

const QuoteIcon = ({
  className,
  color,
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    width="96"
    height="75"
    viewBox="0 0 96 75"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      opacity="0.3"
      d="M90.6748 7.31641C76.5404 9.01771 65.584 21.0385 65.584 35.6104C65.584 37.5121 67.0983 39.0264 69 39.0264H94.376V73.5322H59.8711V35.6104C59.8711 17.9081 73.4015 3.30177 90.6748 1.58496V7.31641ZM32.2334 7.31836C25.5726 8.13384 19.3953 11.2766 14.8076 16.2139C9.90961 21.4853 7.18585 28.4136 7.18164 35.6094V35.6104C7.18164 37.5121 8.69594 39.0264 10.5977 39.0264H35.9736V73.5322H1.46777V35.6104C1.46779 17.9083 14.9982 3.30417 32.2334 1.58594V7.31836Z"
      stroke={color || "#83CD20"}
      strokeWidth="2.93619"
    />
  </svg>
);

const DecorativeArrow = ({
  className,
  style,
  color,
}: {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}) => {
  const fillColor = color || "#83CD20";
  return (
    <svg
      width="133"
      height="53"
      viewBox="0 0 142 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      preserveAspectRatio="none"
    >
      <path
        d="M129.454 45.8403C128.767 44.1949 128.367 43.1588 127.851 42.1535C127.336 41.1481 126.189 40.5407 125.241 41.1376C124.609 41.5356 124.149 42.5736 124.005 43.4127C123.889 44.3585 124.405 45.3638 124.776 46.7507C122.94 46.3279 121.937 45.339 120.761 44.6249C119.155 43.683 118.065 43.7465 117.347 44.7394C116.628 45.7323 116.857 47.0433 118.09 47.9707C120.842 49.9775 123.709 51.9535 126.548 53.8228C128.469 55.0232 129.962 54.6233 131.14 52.5923C131.916 51.3553 132.406 49.9664 133.181 48.7294C134.762 45.9045 136.343 43.0796 137.924 40.2547C138.614 39.1552 138.701 38.1027 137.612 37.2512C136.666 36.4756 135.001 36.6929 134.168 37.7165C133.421 38.6027 132.818 39.5649 132.214 40.527C131.409 42.1148 130.604 43.7027 129.454 45.8403Z"
        fill={fillColor}
      />
      <path
        d="M42.2304 43.141C42.0303 42.3942 42.1169 41.7993 41.8878 41.4033C41.3719 40.8554 40.5977 40.2624 39.9665 40.2029C39.4501 40.1126 38.5312 40.8162 38.3298 41.4419C37.7834 42.6174 37.6672 44.0207 37.2066 45.5162C36.4602 45.9449 35.5703 46.2977 34.7376 46.8639C33.6754 47.4915 32.9284 48.3777 33.4149 49.7339C34.0161 51.0593 35.1351 51.1025 36.3408 50.5507C36.6852 50.4584 36.9148 50.3969 37.3454 50.1672C38.2915 50.9428 38.6341 52.6805 40.471 52.1883C42.7671 51.5731 41.7647 49.6691 42.2539 48.2802C43.0004 47.8515 43.7468 47.4228 44.5219 47.1008C45.6127 46.5798 46.3597 45.6936 45.959 44.6575C45.6727 44.0482 44.5827 43.6541 43.8658 43.2745C43.2922 42.9708 42.8616 43.2006 42.2304 43.141Z"
        fill={fillColor}
      />
      <path
        d="M61.0768 17.9642C60.1288 19.0186 59.2385 19.8289 59.8112 21.0476C60.3838 22.2663 61.5028 22.3095 62.8805 21.9404C66.4394 20.9867 70.0269 20.1398 73.5859 19.1862C74.8487 18.8478 75.9682 18.4335 75.941 16.9543C75.9995 15.7952 74.7381 14.761 73.217 15.0543C69.1417 15.9176 65.1235 16.9942 61.0768 17.9642Z"
        fill={fillColor}
      />
      <path
        d="M17.3632 65.1256C16.492 63.7582 14.6434 63.4531 13.9587 64.6657C12.5287 67.3358 11.3022 70.2944 10.3112 73.1899C10.19 73.6797 11.1218 74.8022 11.8249 75.0712C12.7315 75.6287 13.6769 74.918 14.1833 73.9819C15.3172 71.6198 16.3334 69.2893 17.321 66.8521C17.5314 66.224 17.3313 65.4772 17.3632 65.1256Z"
        fill={fillColor}
      />
      <path
        d="M93.8769 15.4621C93.3319 15.2651 92.443 14.7028 91.5822 14.7048C89.086 14.5732 86.6184 14.5484 84.1508 14.5235C83.0318 14.4803 82.1991 15.0464 81.9971 16.1297C81.8238 17.3196 82.4541 18.2941 83.5731 18.3373C86.5857 18.5592 89.5982 18.7811 92.5251 18.6829C94.1033 18.6031 94.7649 16.9393 93.8769 15.4621Z"
        fill={fillColor}
      />
      <path
        d="M51.1143 26.6926C50.2548 25.322 48.6771 24.9444 47.8439 25.968C46.0052 28.2902 44.2523 30.9325 42.7003 33.4066C42.0968 34.3687 42.6409 35.4807 43.7594 35.9814C44.878 36.4821 45.8254 35.8852 46.429 34.9231C47.7508 32.968 49.1013 31.1197 50.3083 29.1954C50.9404 28.34 51.0276 27.2875 51.1143 26.6926Z"
        fill={fillColor}
      />
      <path
        d="M40.9854 55.4766C40.842 55.4007 39.953 54.8384 39.2642 55.023C38.5754 55.2076 37.6274 56.262 37.5693 56.9636C37.5375 60.0595 38.539 62.8785 40.8609 65.115C41.6922 65.9213 42.7536 66.2087 43.7873 65.4743C44.9358 64.7092 44.6785 63.749 44.163 62.7437C43.2183 60.5956 42.245 58.3408 40.9854 55.4766Z"
        fill={fillColor}
      />
      <path
        d="M123.388 32.3696C122.356 31.2739 120.808 29.6304 119.059 28.1551C118.257 27.4554 117.081 27.1989 116.075 28.0399C114.984 29.0184 115.27 30.0853 116.015 31.0291C117.276 32.5207 118.623 33.8749 119.884 35.3666C121.145 36.8582 122.264 37.3589 123.298 36.6245C124.475 35.9661 124.562 34.4561 123.388 32.3696Z"
        fill={fillColor}
      />
      <path
        d="M55.4265 72.6484C56.7184 71.9592 56.9784 70.1743 55.7165 69.5977C53.1641 68.3377 50.554 67.3219 47.8577 66.4435C47.3127 66.2465 46.1932 66.6608 45.9346 67.0732C45.5897 67.623 45.5026 68.6754 45.9037 69.254C46.7627 71.0821 52.5278 73.3107 54.6229 72.8637C54.8811 72.9088 55.1969 72.7099 55.4265 72.6484Z"
        fill={fillColor}
      />
      <path
        d="M70.9754 49.8427C70.0289 49.5246 69.2547 48.9316 68.5659 49.1162C67.8771 49.3008 66.872 50.1418 66.9001 50.706C66.9836 53.3136 67.2104 55.9971 67.6383 58.5124C67.7812 59.0458 68.9283 59.6532 69.5595 59.7128C70.1621 59.6657 71.2821 58.7939 71.3973 58.3056C71.3715 55.4539 71.1446 52.7704 70.9754 49.8427Z"
        fill={fillColor}
      />
      <path
        d="M108.443 24.8255C109.649 23.8162 109.879 22.8397 109.134 21.8959C108.618 21.3481 107.873 20.8618 107.156 20.4821C105.722 19.7229 104.058 19.0252 102.624 18.2659C101.621 17.7345 100.76 17.7364 99.9843 18.516C99.0078 19.4637 99.2651 20.4239 99.9816 21.261C100.326 21.6262 100.669 21.9914 101.1 22.2192C102.792 23.0236 104.512 23.9347 106.291 24.6016C106.864 24.9053 107.811 24.7659 108.443 24.8255Z"
        fill={fillColor}
      />
      <path
        d="M23.3398 53.4606C22.1046 54.8207 20.6112 56.1356 19.548 57.6783C18.8011 58.5645 18.9722 59.6621 20.0045 60.3003C21.0368 60.9384 21.9267 60.5856 22.9318 59.7446C24.1093 58.6286 25.3441 57.7261 26.665 56.686C27.6987 55.9517 28.4456 55.0655 27.873 53.8468C27.3575 52.8414 26.0379 52.5089 24.4878 53.153C24.1434 53.2453 23.9424 53.4135 23.6266 53.6124C23.5118 53.6432 23.3684 53.5673 23.3398 53.4606Z"
        fill={fillColor}
      />
      <path
        d="M61.5139 43.4599C60.7683 42.9736 60.281 42.5324 59.736 42.3354C58.1297 41.8511 56.5233 41.3667 54.917 40.8824C53.7408 40.6258 52.5642 40.8267 52.276 42.0474C52.1031 42.7798 52.5609 44.0293 53.1345 44.333C55.0848 45.1825 57.2361 45.8639 59.4451 46.3011C59.9615 46.3914 60.909 45.7945 61.2824 45.3514C61.6273 44.8016 61.4272 44.0548 61.5139 43.4599Z"
        fill={fillColor}
      />
      <path
        d="M65.8767 69.8476C66.6523 69.0681 67.916 67.8147 69.0078 66.3787C69.841 65.355 69.6413 64.1507 68.4656 63.4367C67.4333 62.7985 66.4858 63.3954 65.5955 64.2057C64.5041 65.1842 63.4414 66.2694 62.3215 67.1412C61.2016 68.013 60.1679 68.7474 60.9125 70.1487C61.4565 71.2607 62.9485 71.3183 64.5849 70.5368C64.9007 70.3378 65.0155 70.3071 65.8767 69.8476Z"
        fill={fillColor}
      />
    </svg>
  );
};

const Strikes = ({ className }: { className?: string }) => (
  <svg
    width="40"
    height="41"
    viewBox="0 0 40 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.8149 36.9096C23.9316 35.6512 28.859 35.7336 34.0489 35.5828C35.0625 35.5535 35.9051 36.3497 35.9357 37.3602C35.9662 38.3713 35.1663 39.2152 34.1527 39.2451C29.2315 39.388 24.5483 39.2726 19.6881 40.4669C18.7051 40.7087 17.7098 40.1072 17.4717 39.1254C17.2275 38.1442 17.8319 37.1508 18.8149 36.9096Z"
      fill="#E3DBD8"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.8989 26.2183C16.7021 17.6812 26.7401 9.63738 36.8757 4.01515C37.7611 3.52485 38.8785 3.84421 39.3669 4.72833C39.8554 5.61245 39.5379 6.72858 38.6525 7.21888C28.8527 12.6555 19.1444 20.4349 11.6037 28.69C10.9199 29.4361 9.75979 29.488 9.01488 28.806C8.26997 28.124 8.21505 26.9645 8.8989 26.2183Z"
      fill="#E3DBD8"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.375245 24.0537C-0.913082 16.2456 1.28498 8.19749 4.39284 1.09764C4.80193 0.171391 5.88263 -0.251144 6.80461 0.153672C7.7327 0.559098 8.15403 1.64045 7.75104 2.56671C4.91794 9.03276 2.81752 16.3457 3.98984 23.4571C4.1547 24.4548 3.47697 25.3982 2.48172 25.5624C1.48647 25.7273 0.540102 25.0508 0.375245 24.0537Z"
      fill="#E3DBD8"
    />
  </svg>
);

export function AboutUsTemplate17({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}: AboutUsTemplate17Props) {
  const [data, setData] = useState(aboutUsData);
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
        colors: {
          text: "#0F172A",
          primary: "#83CD20",
          primaryForeground: "#034833",
          secondary: "#F59E0B",
          secondaryForeground: "#1F2937",
          background: "#FFFFFF",
        },
        fonts: {
          body: "Inter",
          heading: "Poppins",
        },
      },
    [themeResponse]
  );

  const handleTextUpdate = (field: keyof AboutUs17Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs17Data>);
  };

  const handleImageUpdate = (url: string) => {
    const updatedData = { ...data, imageUrl: url };
    setData(updatedData);
    onUpdate?.({ imageUrl: url });
  };

  const handleButton1LinkUpdate = (text: string, href: string) => {
    const updatedData = {
      ...data,
      button1Text: text,
      button1Link: href,
    };
    setData(updatedData);
    onUpdate?.({
      button1Text: text,
      button1Link: href,
    });
  };

  const handleButton2LinkUpdate = (text: string, href: string) => {
    const updatedData = {
      ...data,
      button2Text: text,
      button2Link: href,
    };
    setData(updatedData);
    onUpdate?.({
      button2Text: text,
      button2Link: href,
    });
  };

  return (
    <section className="mx-auto flex w-full max-w-[1290px] flex-col items-start justify-between gap-10 py-20 lg:flex-row xl:gap-0">
      {/* Left Column: Content */}
      <div className="w-full shrink-0 pt-0 lg:w-[702px]">
        {/* Heading */}
        <EditableText
          value={data.title}
          onChange={handleTextUpdate("title")}
          as="h1"
          isEditable={isEditable}
          placeholder="Visa Got Approved for Eygpt"
          useHeadingFont
        />

        {/* Quote Block */}
        <div className="mt-[30px] mb-[20px]">
          <QuoteIcon
            className="h-[75px] w-[96px]"
            color={theme.colors.primary || "#83CD20"}
          />
        </div>

        <p
          className="max-w-full text-base leading-[30px] font-normal"
          style={{
            color: "#727272",
            fontFamily: theme.fonts.body,
          }}
        >
          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="span"
            isEditable={isEditable}
            placeholder="Enter description..."
            multiline
          />
        </p>

        {/* Details Grid */}
        <div className="my-10 flex flex-col gap-4">
          <div className="relative flex h-[30px] flex-col sm:flex-row sm:items-baseline">
            <h4 className="absolute top-0 left-0 min-w-[135px] text-lg font-semibold">
              <EditableText
                value={data.visaAppliedLabel}
                onChange={handleTextUpdate("visaAppliedLabel")}
                as="span"
                isEditable={isEditable}
                placeholder="Visa Applied:"
              />
            </h4>
            <span
              className="absolute top-0 left-[135px] text-base"
              style={{
                color: "#727272",
                fontFamily: theme.fonts.body,
              }}
            >
              <EditableText
                value={data.visaApplied}
                onChange={handleTextUpdate("visaApplied")}
                as="span"
                isEditable={isEditable}
                placeholder="Visa Special"
              />
            </span>
          </div>

          <div className="relative flex h-[30px] flex-col sm:flex-row sm:items-baseline">
            <h4 className="absolute top-0 left-0 min-w-[135px] text-lg font-semibold">
              <EditableText
                value={data.visaTypeLabel}
                onChange={handleTextUpdate("visaTypeLabel")}
                as="span"
                isEditable={isEditable}
                placeholder="Visa Type:"
              />
            </h4>
            <span
              className="absolute top-0 left-[108px] text-base"
              style={{
                color: "#727272",
                fontFamily: theme.fonts.body,
              }}
            >
              <EditableText
                value={data.visaType}
                onChange={handleTextUpdate("visaType")}
                as="span"
                isEditable={isEditable}
                placeholder="10 years +"
              />
            </span>
          </div>

          <div className="relative flex h-[30px] flex-col sm:flex-row sm:items-baseline">
            <h4 className="absolute top-0 left-0 min-w-[135px] text-lg font-semibold">
              <EditableText
                value={data.approvalLabel}
                onChange={handleTextUpdate("approvalLabel")}
                as="span"
                isEditable={isEditable}
                placeholder="Approval:"
              />
            </h4>
            <span
              className="absolute top-0 left-[106px] text-base"
              style={{
                color: "#727272",
                fontFamily: theme.fonts.body,
              }}
            >
              <EditableText
                value={data.approval}
                onChange={handleTextUpdate("approval")}
                as="span"
                isEditable={isEditable}
                placeholder="adbs@gmail.com"
              />
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-[30px]">
          <EditableLink
            text={data.button1Text}
            href={data.button1Link || "#"}
            onChange={handleButton1LinkUpdate}
            isEditable={isEditable}
            siteUser={siteUser}
            className="hover:bg-opacity-90 flex h-[60px] w-[180px] items-center justify-center gap-2 rounded-full bg-[#83CD20] text-sm font-semibold transition-colors"
            style={{
              backgroundColor: theme.colors.primary || "#83CD20",
              color: theme.colors.primaryForeground || "#034833",
              fontFamily: theme.fonts.body,
            }}
            textPlaceholder="Apply For Visa"
            hrefPlaceholder="#"
          >
            <>
              <span>{data.button1Text || "Apply For Visa"}</span>
              <ChevronRight size={14} strokeWidth={3} />
            </>
          </EditableLink>

          <div className="button-2-wrapper">
            <style>{`
              .button-2-wrapper a:hover {
                background-color: ${theme.colors.primary || "#83CD20"}1A !important;
              }
            `}</style>
            <EditableLink
              text={data.button2Text}
              href={data.button2Link || "#"}
              onChange={handleButton2LinkUpdate}
              isEditable={isEditable}
              siteUser={siteUser}
              className="flex h-[60px] w-[186px] items-center justify-center rounded-full border bg-transparent text-sm font-semibold transition-colors"
              textPlaceholder="Read More Stories"
              hrefPlaceholder="#"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Image Cards */}
      <div className="relative mt-12 h-[600px] w-full flex-shrink-0 lg:mt-0 lg:w-[528px]">
        {/* Decorative Arrow - Positioned Top Left pointing to cards */}
        <div className="pointer-events-none absolute top-[-20px] left-[-40px] z-20">
          <DecorativeArrow
            className="h-[60px] w-[140px] opacity-50"
            style={{ transform: "rotate(-15deg)" }}
            color={theme.colors.primary || "#83CD20"}
          />
        </div>

        {/* Strikes - Positioned Top Right behind the back card */}
        <div className="pointer-events-none absolute top-[40px] right-[-20px] z-0">
          <Strikes className="h-[51px] w-[50px] opacity-60" />
        </div>

        {/* Back Card (Light Green) */}
        <div
          className="absolute z-0 h-[475px] w-[331px] origin-center rounded-[22px] bg-[#F1F5EB]"
          style={{
            left: "120px",
            top: "66px",
            transform: "rotate(10deg)",
          }}
        ></div>

        {/* Front Card (Gray with Green Border) */}
        <div
          className="absolute z-10 flex h-[482px] w-[418px] origin-center items-center justify-center overflow-hidden rounded-[22px] border-[6px] border-[#83CD20] bg-[#D9D9D9] shadow-sm"
          style={{
            left: "0px",
            top: "75px",
            transform: "rotate(-5deg)",
            borderColor: theme.colors.primary || "#83CD20",
          }}
        >
          <EditableImage
            src={data.imageUrl}
            alt={data.imageAlt}
            onImageChange={handleImageUpdate}
            isEditable={isEditable}
            className="h-full w-full object-cover"
            width={418}
            height={482}
          />
        </div>
      </div>
    </section>
  );
}
