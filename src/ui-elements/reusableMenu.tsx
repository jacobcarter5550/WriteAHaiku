import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface ReusableMenuProps {
  buttonLabel: string;
  menuItems: [string, React.ReactNode][] | string[];
  img?: any;
  subHeading?: string;
  onItemClick: (item: string) => void;
  classValue: any;
}

const ReusableMenu: React.FC<ReusableMenuProps> = ({
  buttonLabel,
  menuItems,
  img,
  onItemClick,
  classValue,
  subHeading,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: string) => {
    handleClose();
    onItemClick(item);
  };

  return (
    <div style={{ marginLeft: "1vw" }} className={classValue}>
      {img && <img style={{ width: "3.75rem" }} src={img} />}
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        style={{
          color: "#525252",
          textTransform: "capitalize",
          display: "block",
        }}
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <div
          style={{ textAlign: "left", textTransform: "capitalize" }}
          className="title"
        >
          {buttonLabel}
        </div>
        <div className="role" title={subHeading && subHeading}>{subHeading && subHeading}</div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {menuItems.length > 0 &&
          menuItems.map((item, index) => (
            <MenuItem
              style={{ textTransform: "capitalize" }}
              key={index}
              onClick={() => handleMenuItemClick(item)}
            >
              {item}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default ReusableMenu;
