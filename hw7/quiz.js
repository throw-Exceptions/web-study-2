$(".submit-button").click(() => {
  const q1Selected = $(".q1:checked");
  const q2Selected = $(".q2:checked");
  const q3Selected = $(".q3:checked");
  
  if (q1Selected.length !== 1 || q2Selected.length !== 1 || q3Selected.length !== 1) {
    window.alert("문제당 정답 하나씩만 선택해주세요.");
    return;
  }

  let correctCount = 0;
  if ($(q1Selected[0]).val() === "correct") correctCount += 1;
  if ($(q2Selected[0]).val() === "correct") correctCount += 1;
  if ($(q3Selected[0]).val() === "correct") correctCount += 1;

  $(".container").empty();
  $(".container").append($(`
    <h1>${Math.round(100 / 3 * correctCount)}점</h1>
  `));
});