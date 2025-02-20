export const IconInspectCode = ({
  dxSize = 24,
  ...restProps
}: React.SVGProps<SVGSVGElement> & { dxSize: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={dxSize}
    height={dxSize}
    color="currentColor"
    fill={"none"}
    {...restProps}
  >
    <path
      d="M17.5 17.5L22 22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 9.5L15.4199 10.2929C15.8066 10.6262 16 10.7929 16 11C16 11.2071 15.8066 11.3738 15.4199 11.7071L14.5 12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 9.5L6.58009 10.2929C6.19337 10.6262 6 10.7929 6 11C6 11.2071 6.19336 11.3738 6.58009 11.7071L7.5 12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8.5L10 13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
