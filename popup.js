const addTabButton = document.getElementById('add-tab');
const tabList = document.getElementById('tab-list');

chrome.storage.sync.get('TTG', function(result) {
  // chrome.storage에는 객체는 들어가지만 Map은 안 들어간다
  // 객체는 Map과 달리 순서 변경이 안 된다...ㅜㅜ
  if (result.TTG) {
    const iterableTTG = Object.entries(result.TTG);
    iterableTTG.forEach(function([tabURL, tab]) {
      addTab(tab);
    });
  } else {
    chrome.storage.sync.set({ TTG: {} });
  }
});

addTabButton.onclick = function(e) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    chrome.storage.sync.get('TTG', function(result) {
      // 중복되는 거 추가하는 거 나중에 하기! 나중에 폴더 구분을 하면 구현해야 함
      if (result.TTG[currentTab.url]) {
        // alert('이미 저장한 탭(링크?)입니다.');
      } else {
        result.TTG[currentTab.url] = currentTab;
        chrome.storage.sync.set({ TTG: result.TTG }, function() {
          addTab(currentTab);
        });
      }
    });
  });
};

function addTab(tab) {
  const tabContainer = document.createElement('div');
  const tabFavicon = document.createElement('img');
  const tabURL = document.createElement('a');
  const deleteTabButton = document.createElement('button');

  tabContainer.className = 'tab-container';

  tabContainer.appendChild(tabFavicon);
  tabContainer.appendChild(tabURL);
  tabContainer.appendChild(deleteTabButton);

  tabFavicon.src = tab.favIconUrl ? tab.favIconUrl : './images/get_started16.png';
  // tabFavicon.width = 16;
  // tabFavicon.height = 16;
  tabFavicon.alt = `favicon of ${tab.URL}`;

  tabURL.href = tab.url;
  tabURL.target = '_blank';
  tabURL.text = tab.title;

  deleteTabButton.innerText = 'x';
  deleteTabButton.onclick = function(e) {
    chrome.storage.sync.get('TTG', function(result) {
      delete result.TTG[tab.url];
      chrome.storage.sync.set({ TTG: result.TTG }, function() {
        e.target.parentNode.remove();
      });
    });
  };

  tabList.appendChild(tabContainer);
}

// 이 방법은 팝업을 껐다 켜면 순서가 바뀌어 있을 수도 있어서 조금 그렇지만...
// 전체를 굳이 다시 렌더하는 것보다는 일단 이렇게 구현해 둠
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.shortcut === 'addTab') {
    addTab(request.currentTab);
    sendResponse('Tab added');
  }
});
