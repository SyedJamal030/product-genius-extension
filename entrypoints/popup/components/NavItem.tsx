import React from "react";

interface NavItemProps {
  label: string;
  tab: string;
  selectedTab: string;
  icon: React.ReactNode;
  onClick: (tabName: string) => void;
}

export const NavItem = ({
  icon,
  label,
  tab,
  selectedTab,
  onClick,
}: NavItemProps) => {
  const isSelected = selectedTab === tab;
  return (
    <button
      type="button"
      onClick={() => onClick(tab)}
      className={`footer__nav--item ${isSelected ? "active" : ""}`}
      title={label}
    >
      <span className="footer__nav--icon">{icon}</span>
    </button>
  );
};

export default NavItem;
