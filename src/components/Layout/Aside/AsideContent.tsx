import { ADMIN_LINKS, USER_LINKS } from "./constants";
import { AsideLink } from "./AsideLink";

export const AdminNavigation = ({ isExpanded, pathname }: any) => (
  <ul className="flex flex-col gap-2">
    {ADMIN_LINKS.map((link) => (
      <AsideLink
        key={link.label}
        {...link}
        isExpanded={isExpanded}
        isActive={pathname.split("/").includes(link.label.toLowerCase())}
        visual={<i className={`${link.icon} text-xl flex-shrink-0`}></i>}
      />
    ))}
  </ul>
);

export const UserNavigation = ({ isExpanded, pathname }: any) => (
  <ul className="flex flex-col gap-2">
    {USER_LINKS.map((link) => (
      <AsideLink
        key={link.label}
        {...link}
        isExpanded={isExpanded}
        isActive={pathname === link.href}
        visual={<i className={`${link.icon} text-xl flex-shrink-0`}></i>}
      />
    ))}
  </ul>
);
