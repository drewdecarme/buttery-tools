import type { ButteryConfigDocsHeaderLink } from "@buttery/core";
import { type FC, Fragment } from "react";
import { match } from "ts-pattern";

export const LayoutHeaderLinks: FC<{
  links?: ButteryConfigDocsHeaderLink[];
}> = ({ links = [] }) => {
  return links.map((link) => {
    return (
      <Fragment key={link.href}>
        {match(link)
          .with({ type: "social" }, (socialLink) => {
            return <a href={socialLink.href}>{socialLink.provider}</a>;
          })
          .with({ type: "text" }, (socialLink) => {
            return <a href={socialLink.href}>{socialLink.text}</a>;
          })
          .with({ type: "internal" }, (socialLink) => {
            return <a href={socialLink.href}>{socialLink.text}</a>;
          })
          .exhaustive()}
      </Fragment>
    );
  });
};
