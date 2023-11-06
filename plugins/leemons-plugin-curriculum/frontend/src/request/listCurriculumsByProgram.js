async function listCurriculumsByProgram(program) {
  return leemons.api(`v1/curriculum/curriculum?page=0&size=99999999&program=${program}`, {
    allAgents: true,
  });
}

export default listCurriculumsByProgram;
