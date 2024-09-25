// set cookies
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }
  
  // read
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
  }
  
  // delete 
  function deleteCookie(name) {
    setCookie(name, '', -1); // old ones will delete 
  }
  
  // print existing cookies
  function logCookies() {
    console.log('Mevcut çerezler:', document.cookie);
  }
  
  // Check last Video cookie on page load
  function playLastVideo() {
    const lastVideo = getCookie("lastVideo");
    const lastFolder = getCookie("lastFolder");
  
    if (lastVideo && lastFolder) {
      const videoContainer = document.querySelector(".video-container");
      
      
  
      videoContainer.innerHTML = `
        <div class="video-title">
          <h2>${lastFolder} - ${lastVideo}</h2>
        </div>
        <video controls autoplay>
          <source src="${lastFolder}/${lastVideo}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
      console.log(`Oynatılan video: ${lastFolder}/${lastVideo}`);
    } else {
      console.log("Çerezde hiç video bulunamadı.");
    }
  }
  
  
  // example
  document.addEventListener("DOMContentLoaded", () => {
    logCookies();
    playLastVideo();
  });
  