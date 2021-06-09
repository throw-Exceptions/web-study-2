let myName = "당신";

$("#send-button").click(sendText);

$("#text-contents").keypress(e => {
  if (e.key != "Enter") return;
  e.preventDefault();
  sendText();
});

$("#image-input").change(e => {
  const image = e.target.files[0];
  if (!image) return;
  sendImage(image);
});

function sendImage(image) {
  const fileReader = new FileReader();
  fileReader.onload = e => {
    const dataUrl = fileReader.result;
    const $messageDiv = $(createImageMessageDiv(myName, dataUrl));
    $(".message-display").append($messageDiv);
    $("#image-input").val("");
    scrollToLastMessage();
  };
  fileReader.readAsDataURL(image);
}

function sendText() {
  const contents = $("#text-contents").val();
  if (contents.length === 0) return;
  const $messageDiv = $(createTextMessageDiv(myName, contents));
  $(".message-display").append($messageDiv);
  $("#text-contents").val("");
  scrollToLastMessage();
}

function scrollToLastMessage() {
  const lastMessageOffset = $(".message").last().offset();
  $(".message-display").animate({ scrollTop: lastMessageOffset.top }, 400);
}

function createTextMessageDiv(name, contents) {
  return `
    <div class="message">
      <div class="profile">
        <i class="fas fa-user"></i>
      </div>
      <div>
        <div class="name">
          ${name}
        </div>
        <div class="contents">
          ${contents}
        </div>
      </div>
    </div>
  `;
}

function createImageMessageDiv(name, url) {
  return `
    <div class="message">
      <div class="profile">
        <i class="fas fa-user"></i>
      </div>
      <div>
        <div class="name">
          ${name}
        </div>
        <div class="contents">
          <img src="${url}">
        </div>
      </div>
    </div>
  `;
}