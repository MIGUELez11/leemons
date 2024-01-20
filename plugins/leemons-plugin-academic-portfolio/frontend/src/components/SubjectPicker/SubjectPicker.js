import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { findIndex, noop, uniq } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import {
  ActionButton,
  Box,
  Stack,
  Button,
  InputWrapper,
  Select,
  Table,
  ContextContainer,
} from '@bubbles-ui/components';
import { AddCircleIcon, DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { useDataForSubjectPicker } from './hooks/useDataForSubjectPicker';
import { useSubjectPickerStyles } from './SubjectPicker.styles';

export function SubjectPicker({
  assignable,
  localizations,
  value,
  onChange = noop,
  onChangeRaw = noop,
  error,
  hideSectionHeaders,
  onlyOneSubject,
  ...props
}) {
  const form = useForm({
    defaultValues: {
      program: undefined,
      course: undefined,
      subject: undefined,
      selectedSubjects: value || [],
    },
  });

  const { programs, courses, subjects, selectedSubjects } = useDataForSubjectPicker({
    subjects: assignable?.subjects,
    control: form.control,
  });

  useEffect(() => {
    form.setValue('selectedSubjects', value || []);
    onChange(value || []);
  }, [JSON.stringify(value)]);

  useEffect(() => {
    onChangeRaw(selectedSubjects);
  }, [JSON.stringify(selectedSubjects)]);

  const { classes } = useSubjectPickerStyles({}, { name: 'SubjectPicker' });

  const isDisabled = useMemo(() => {
    if (onlyOneSubject) {
      return selectedSubjects?.length;
    }
    return false;
  }, [onlyOneSubject, selectedSubjects]);

  const onSubmit = ({ selectedSubjects: data, ...newSubject }) => {
    const newSelectedSubjects = [newSubject?.subject, ...data];
    form.setValue('selectedSubjects', uniq(newSelectedSubjects));
    onChange(newSelectedSubjects);

    return false;
  };

  const onRemove = ({ id }) => {
    const selSubjects = form.getValues('selectedSubjects');

    const index = findIndex(selSubjects, (subject) => subject === id);

    if (index >= 0) {
      const newSelectedSubjects = [...selSubjects];
      newSelectedSubjects.splice(index, 1);
      form.setValue('selectedSubjects', newSelectedSubjects);
      onChange(newSelectedSubjects);
    }
  };

  const columns = React.useMemo(() => {
    const result = [
      {
        Header: '',
        accessor: 'program',
        style: {
          width: courses ? '30%' : '45%',
        },
      },
    ];
    if (courses) {
      result.push({
        Header: '',
        accessor: 'course',
        style: {
          width: '30%',
        },
      });
    }

    result.push(
      {
        Header: '',
        accessor: 'subject',
        style: {
          width: courses ? '30%' : '45%',
        },
      },
      {
        Header: '',
        accessor: 'action',
        style: {
          width: '10%',
        },
      }
    );
    return result;
  }, [courses]);

  return (
    <ContextContainer title={localizations?.title} spacing={0}>
      <InputWrapper error={error}>
        <Stack fullWidth className={classes.subjectPicker}>
          <Box>
            <Controller
              control={form.control}
              name="program"
              render={({ field }) => (
                <Select
                  {...field}
                  cleanOnMissingValue
                  label={localizations?.program}
                  placeholder={localizations?.placeholder}
                  data={programs}
                  disabled={!programs?.length || isDisabled}
                />
              )}
            />
          </Box>

          {courses !== null && (
            <Box>
              <Controller
                control={form.control}
                name="course"
                shouldUnregister
                render={({ field }) => (
                  <Select
                    {...field}
                    cleanOnMissingValue
                    label={localizations?.course}
                    placeholder={localizations?.placeholder}
                    data={courses}
                    disabled={!courses?.length || isDisabled}
                  />
                )}
              />
            </Box>
          )}
          <Box>
            <Controller
              control={form.control}
              name="subject"
              render={({ field }) => (
                <Select
                  {...field}
                  cleanOnMissingValue
                  label={localizations?.subject}
                  placeholder={localizations?.placeholder}
                  data={subjects}
                  disabled={!subjects?.length || isDisabled}
                />
              )}
            />
          </Box>
          <Box noFlex>
            <Button
              leftIcon={<AddCircleIcon />}
              variant="link"
              onClick={form.handleSubmit(onSubmit)}
            >
              {localizations?.add}
            </Button>
          </Box>
        </Stack>
      </InputWrapper>
      {selectedSubjects?.length > 0 ? (
        <Box className={classes.table}>
          <Table
            data={selectedSubjects.map((subject) => ({
              ...subject,
              course: subject?.course ?? '-',
              action: (
                <ActionButton
                  icon={<DeleteBinIcon width={18} height={18} />}
                  onClick={() => onRemove(subject)}
                />
              ),
            }))}
            columns={columns}
          />
        </Box>
      ) : null}
    </ContextContainer>
  );
}

SubjectPicker.propTypes = {
  localizations: PropTypes.object,
  assignable: PropTypes.object,
  onChange: PropTypes.func,
  onChangeRaw: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.any,
  hideSectionHeaders: PropTypes.bool,
  onlyOneSubject: PropTypes.bool,
};

export default SubjectPicker;
