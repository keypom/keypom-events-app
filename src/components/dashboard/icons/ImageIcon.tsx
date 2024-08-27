import { Icon, type IconProps } from "@chakra-ui/react";

export const ImageIcon = (props: IconProps) => {
  return (
    <Icon
      fill="transparent"
      h="33px"
      viewBox="0 0 33 33"
      w="33px"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M23 31.5H7.55228C6.54259 31.5 6.03775 31.5 5.80397 31.3003C5.60113 31.1271 5.49348 30.8672 5.51441 30.6013C5.53853 30.2948 5.89552 29.9378 6.60948 29.2239L20.781 15.0523C21.4411 14.3923 21.7711 14.0622 22.1516 13.9386C22.4864 13.8298 22.847 13.8298 23.1817 13.9386C23.5622 14.0622 23.8923 14.3923 24.5523 15.0523L31 21.5V23.5M23 31.5C25.8003 31.5 27.2004 31.5 28.27 30.955C29.2108 30.4757 29.9757 29.7108 30.455 28.77C31 27.7004 31 26.3003 31 23.5M23 31.5H9C6.19974 31.5 4.79961 31.5 3.73005 30.955C2.78924 30.4757 2.02433 29.7108 1.54497 28.77C1 27.7004 1 26.3003 1 23.5V9.5C1 6.69974 1 5.29961 1.54497 4.23005C2.02433 3.28924 2.78924 2.52433 3.73005 2.04497C4.79961 1.5 6.19974 1.5 9 1.5H23C25.8003 1.5 27.2004 1.5 28.27 2.04497C29.2108 2.52433 29.9757 3.28924 30.455 4.23005C31 5.29961 31 6.69974 31 9.5V23.5M13.5 10.6667C13.5 12.5076 12.0076 14 10.1667 14C8.32572 14 6.83333 12.5076 6.83333 10.6667C6.83333 8.82572 8.32572 7.33333 10.1667 7.33333C12.0076 7.33333 13.5 8.82572 13.5 10.6667Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
};
