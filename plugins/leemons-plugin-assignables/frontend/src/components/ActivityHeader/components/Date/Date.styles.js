import { createStyles } from '@bubbles-ui/components';

export const useDateStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.sm,
      alignItems: 'center',
    },
    icon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 24,
      height: 24,
      color: '#878D96',
    },
    text: {
      fontSize: { ...globalTheme.content.typoMobile.body['sm--bold'] },
      color: globalTheme.content.color.text.default,
    },
  };
});

export default useDateStyles;
