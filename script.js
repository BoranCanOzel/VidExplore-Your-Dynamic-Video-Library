document.addEventListener("DOMContentLoaded", function () {
  fetch("whatfoldersarehere.php")
    .then((response) => response.json())
    .then((data) => {
      const folderList = document.getElementById("folderList");
      data.forEach((folder) => {
        const li = document.createElement("li");
        li.innerHTML = `<button class="folder" data-folder="${folder}">${folder} <span class="toggle-arrow">&#9654;</span></button><ul class="items" style="display: none;"></ul>`;
        folderList.appendChild(li);

        const folderButton = li.querySelector(".folder");
        folderButton.addEventListener("click", function () {
          const items = this.nextElementSibling;
          const arrow = this.querySelector(".toggle-arrow");
          if (items.style.display === "none") {
            items.style.display = "block";
            arrow.innerHTML = "&#9660;"; // Down arrow
            if (items.childElementCount === 0) {
              const folderName = this.getAttribute("data-folder");
              fetch(
                `getVideosInFolder.php?folder=${encodeURIComponent(folderName)}`
              )
                .then((response) => response.json())
                .then((contents) => {
                  contents.forEach((content) => {
                    if (content.type === "folder") {
                      const subLi = document.createElement("li");
                      subLi.innerHTML = `<button class="sub-folder" data-folder="${folderName}/${content.name}">${content.name} <span class="toggle-arrow">&#9654;</span></button><ul class="sub-items" style="display: none;"></ul>`;
                      items.appendChild(subLi);

                      const subFolderButton =
                        subLi.querySelector(".sub-folder");
                      subFolderButton.addEventListener("click", function () {
                        const subItems = this.nextElementSibling;
                        const subArrow = this.querySelector(".toggle-arrow");
                        if (subItems.style.display === "none") {
                          subItems.style.display = "block";
                          subArrow.innerHTML = "&#9660;"; // Down arrow
                          if (subItems.childElementCount === 0) {
                            const subFolderName =
                              this.getAttribute("data-folder");
                            fetch(
                              `getVideosInFolder.php?folder=${encodeURIComponent(
                                subFolderName
                              )}`
                            )
                              .then((response) => response.json())
                              .then((subContents) => {
                                subContents.forEach((subContent) => {
                                  if (subContent.type === "folder") {
                                    const subSubLi =
                                      document.createElement("li");
                                    subSubLi.innerHTML = `<button class="sub-folder" data-folder="${subFolderName}/${subContent.name}">${subContent.name} <span class="toggle-arrow">&#9654;</span></button><ul class="sub-items" style="display: none;"></ul>`;
                                    subItems.appendChild(subSubLi);
                                  } else {
                                    const subItemLi =
                                      document.createElement("li");
                                    const subVideoButton =
                                      document.createElement("button");
                                    subVideoButton.classList.add("video-item");
                                    subVideoButton.dataset.video =
                                      encodeURIComponent(subContent.video);
                                    subVideoButton.dataset.description =
                                      subContent.description;
                                    subVideoButton.textContent =
                                      subContent.name;
                                    subItemLi.appendChild(subVideoButton);
                                    subItems.appendChild(subItemLi);

                                    subVideoButton.addEventListener(
                                      "click",
                                      function () {
                                        const previouslySelected =
                                          document.querySelector(".selected");
                                        if (previouslySelected) {
                                          previouslySelected.classList.remove(
                                            "selected"
                                          );
                                        }

                                        this.classList.add("selected");

                                        const videoContainer =
                                          document.querySelector(
                                            ".video-container"
                                          );
                                        videoContainer.innerHTML = `
                                        <div class="video-title">
                                          <h2>${this.textContent}</h2>
                                          <a href="${subFolderName}/${
                                          this.dataset.video
                                        }" download class="download-button">Download</a>
                                        </div>
                                        <video controls>
                                          <source src="${subFolderName}/${
                                          this.dataset.video
                                        }" type="video/mp4">
                                          Your browser does not support the video tag.
                                        </video>
                                        <p>${this.dataset.description.replace(
                                          /\n/g,
                                          "<br>"
                                        )}</p>
                                      `;

                                        document.body.classList.add(
                                          "menu-hidden"
                                        );
                                        document.body.classList.remove(
                                          "menu-visible"
                                        );
                                      }
                                    );
                                  }
                                });
                              })
                              .catch((error) =>
                                console.error(
                                  `Error fetching contents of subfolder ${subFolderName}:`,
                                  error
                                )
                              );
                          }
                        } else {
                          subItems.style.display = "none";
                          subArrow.innerHTML = "&#9654;"; // Right arrow
                        }
                      });
                    } else {
                      const itemLi = document.createElement("li");
                      const videoButton = document.createElement("button");
                      videoButton.classList.add("video-item");
                      videoButton.dataset.video = encodeURIComponent(
                        content.video
                      );
                      videoButton.dataset.description = content.description;
                      videoButton.textContent = content.name;
                      itemLi.appendChild(videoButton);
                      items.appendChild(itemLi);

                      videoButton.addEventListener("click", function () {
                        const previouslySelected =
                          document.querySelector(".selected");
                        if (previouslySelected) {
                          previouslySelected.classList.remove("selected");
                        }

                        this.classList.add("selected");

                        const videoContainer =
                          document.querySelector(".video-container");
                        videoContainer.innerHTML = `
                          <div class="video-title">
                            <h2>${this.textContent}</h2>
                            <a href="${folderName}/${
                          this.dataset.video
                        }" download class="download-button">Download</a>
                          </div>
                          <video controls>
                            <source src="${folderName}/${
                          this.dataset.video
                        }" type="video/mp4">
                            Your browser does not support the video tag.
                          </video>
                          <p>${this.dataset.description.replace(
                            /\n/g,
                            "<br>"
                          )}</p>
                        `;

                        document.body.classList.add("menu-hidden");
                        document.body.classList.remove("menu-visible");
                      });
                    }
                  });
                })
                .catch((error) =>
                  console.error(
                    `Error fetching contents of folder ${folderName}:`,
                    error
                  )
                );
            }
          } else {
            items.style.display = "none";
            arrow.innerHTML = "&#9654;"; // Right arrow
          }
        });
      });
    })
    .catch((error) => console.error("Error fetching folder names:", error));

  // Add back to menu button functionality
  const videoContainer = document.querySelector(".video-container");
  const backToMenuButton = document.createElement("a");
  backToMenuButton.href = "#";
  backToMenuButton.classList.add("back-to-menu-button");
  backToMenuButton.textContent = "Back to Menu";
  backToMenuButton.addEventListener("click", function (e) {
    e.preventDefault();
    document.body.classList.remove("menu-hidden");
    document.body.classList.add("menu-visible");
    document.querySelector(".video-container").innerHTML = "";
    document.querySelector(".sidebar").scrollIntoView();
  });

  videoContainer.parentNode.insertBefore(
    backToMenuButton,
    videoContainer.nextSibling
  );

  // Set initial class for mobile view
  if (window.innerWidth <= 768) {
    document.body.classList.add("menu-visible");
  }
});
