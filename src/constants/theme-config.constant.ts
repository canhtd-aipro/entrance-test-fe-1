import { ThemeConfig } from 'antd';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

export const fullTailwindConfig = resolveConfig(tailwindConfig);

const screens = {
  sm: Number(fullTailwindConfig.theme.screens.sm.slice(0, -2)),
  md: Number(fullTailwindConfig.theme.screens.md.slice(0, -2)),
  lg: Number(fullTailwindConfig.theme.screens.lg.slice(0, -2)),
  xl: Number(fullTailwindConfig.theme.screens.xl.slice(0, -2)),
  xxl: Number(fullTailwindConfig.theme.screens['2xl'].slice(0, -2)),
};

export const themeConfig: ThemeConfig = {
  hashed: true,
  token: {
    borderRadius: 4,
    colorPrimaryBorder: 'transparent',
    colorPrimary: fullTailwindConfig.theme.colors.primary,
    colorPrimaryBg: fullTailwindConfig.theme.colors.primary_bg,
    colorLink: fullTailwindConfig.theme.colors.link,
    colorText: fullTailwindConfig.theme.colors.neutral,
    colorBorder: fullTailwindConfig.theme.colors.border,
    colorError: fullTailwindConfig.theme.colors.danger,
    colorBgContainerDisabled: fullTailwindConfig.theme.colors.disabled,
    colorTextPlaceholder: fullTailwindConfig.theme.colors.placeholder,
    fontFamily: 'Noto Sans JP, Roboto',
    controlHeightLG: 40,
    controlHeight: 32,
    controlHeightSM: 22,
    // SM
    screenSM: screens.sm,
    screenSMMin: screens.sm,
    screenSMMax: screens.md - 1,

    // MD
    screenMD: screens.md,
    screenMDMin: screens.md,
    screenMDMax: screens.lg - 1,

    // LG
    screenLG: screens.lg,
    screenLGMin: screens.lg,
    screenLGMax: screens.xl - 1,

    // XL
    screenXL: screens.xl,
    screenXLMin: screens.xl,
    screenXLMax: screens.xxl - 1,

    // XXL
    screenXXL: screens.xxl,
    screenXXLMin: screens.xxl,
  },
  components: {
    Layout: {
      bodyBg: fullTailwindConfig.theme.colors.layout_bg,
    },
    Table: {
      cellPaddingBlock: 12,
      cellPaddingBlockMD: 4,
      cellPaddingBlockSM: 2,
      cellPaddingInline: 16,
      cellPaddingInlineMD: 8,
      cellPaddingInlineSM: 6,
      headerBg: fullTailwindConfig.theme.colors.neutral_bg,
      borderColor: fullTailwindConfig.theme.colors.border,
      rowHoverBg: fullTailwindConfig.theme.colors.neutral_bg,
    },
    Button: {
      controlOutline: 'none',
      fontSizeLG: 14,
    },
    Dropdown: {
      borderRadiusXS: 4,
      borderRadiusSM: 4,
      borderRadiusLG: 4,
    },
    Menu: {
      borderRadius: 4,
      itemBorderRadius: 0,
      itemMarginInline: 0,
      itemSelectedBg: fullTailwindConfig.theme.colors.primary,
      subMenuItemBg: fullTailwindConfig.theme.colors.neutral_bg,
      itemSelectedColor: fullTailwindConfig.theme.colors.white,
    },
    Breadcrumb: {
      colorBgTextHover: 'transparent',
    },
    Select: {
      borderRadius: 4,
      colorTextDisabled: fullTailwindConfig.theme.colors.text_disabled,
    },
    // Checkbox: {
    //   colorPrimary: fullTailwindConfig.theme.colors.secondary,
    //   colorPrimaryHover: fullTailwindConfig.theme.colors.secondary,
    // },
    Typography: {
      colorTextDisabled: fullTailwindConfig.theme.colors.link_disabled,
    },
    Input: {
      colorTextDisabled: fullTailwindConfig.theme.colors.text_disabled,
    },
    InputNumber: {
      colorTextDisabled: fullTailwindConfig.theme.colors.text_disabled,
    },
    DatePicker: {
      colorTextDisabled: fullTailwindConfig.theme.colors.text_disabled,
    },
  },
};
