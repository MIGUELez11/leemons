import React from 'react';
import PropTypes from 'prop-types';
import { Box, COLORS, Text } from '@bubbles-ui/components';
import { htmlToText } from '@common';

export default function QuestionTitle(props) {
  const { styles, question, store, cx, t } = props;

  console.log('props', props);

  let classNameQuestionTitle = styles.questionTitle;
  if (store.embedded) {
    classNameQuestionTitle = cx(classNameQuestionTitle, styles.questionTitleEmbedded);
  }

  const colorByStatus = {
    ok: COLORS.fatic02,
    ko: COLORS.fatic01,
    null: null,
  };

  console.log(question.question);

  return (
    <Box className={classNameQuestionTitle}>
      <Box className={styles.questionTitleText}>
        <Text size="lg" role="productive" color="primary" strong>
          {props.index + 1}. {htmlToText(question.question)}
        </Text>
      </Box>
      {store.embedded && store.viewMode ? (
        <Box className={cx(styles.questionValueCard, styles.questionValueCardEmbedded)}>
          <Box>
            <Text
              size="md"
              sx={(theme) => ({
                color: store.viewMode
                  ? colorByStatus[store.questionResponses?.[question.id].status]
                  : theme.colors.fatic02,
              })}
            >
              {store.viewMode
                ? store.questionResponses?.[question.id].points
                : store.questionsInfo.perQuestion}
            </Text>
          </Box>
          <Text size="xs" color="primary">
            {t('pointsInTotal')}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}

QuestionTitle.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
};
