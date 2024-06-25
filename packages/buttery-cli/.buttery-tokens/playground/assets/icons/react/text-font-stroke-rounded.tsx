import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgTextFontStrokeRounded = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    color="currentColor"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m14 19-2.893-8.252C9.763 6.916 9.092 5 8 5s-1.763 1.916-3.107 5.748L2 19m2.5-7h7M21.97 13.94v4.5m0-4.5c.046-.824.048-1.45-.05-1.963-.234-1.206-1.494-1.933-2.714-2.081-1.168-.142-2.104.159-3.052 1.54m5.815 2.503h-2.843c-.437 0-.878.021-1.299.138-2.573.716-2.384 4.323.196 4.768.287.05.58.07.87.058.677-.03 1.302-.358 1.84-.773.627-.486 1.236-1.165 1.236-2.19z"
    />
  </svg>
);
export default SvgTextFontStrokeRounded;
