// import { css } from "@linaria/core";

// import { useTooltip } from "../useDropdownTooltip.js";

// const tooltipCss = css`
//   padding: 0.5rem 1rem;
//   background: black;
//   color: white;
//   border: 0;
//   border-radius: 0.5rem;
// `;

// const targetCss = css`
//   border: 0;
//   padding: 0;
//   background: 0;
//   height: 32px;
//   width: 32px;
//   display: grid;
//   place-content: center;
//   position: relative;
// `;

// export default () => {
//   const { targetProps, tooltipProps } = useTooltip({
//     dxType: "tooltip",
//     dxKind: "label",
//     dxLabeledBy: "save",
//   });

//   return (
//     <>
//       <button
//         {...targetProps}
//         className={targetCss}
//         onClick={() => alert("Saved!!")}
//       >
//         Save
//       </button>
//       <div {...tooltipProps} className={tooltipCss}>
//         Save your work to the system
//       </div>
//     </>
//   );
// };
