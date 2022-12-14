function calculateDays(date) {
  //get current date
  const currentDate = new Date();
  const chosenDate = new Date(date);

  //calculate the difference between the two dates
  const difference = chosenDate.getTime() - currentDate.getTime();

  //convert the difference from milliseconds to days
  const days = Math.round(difference / (1000 * 60 * 60 * 24));

  return days;
}

export { calculateDays };
