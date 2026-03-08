
let allIssues = [];


function handleLogin() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "admin123") {
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("main-page").classList.remove("hidden");

    fetchIssues();
    setTimeout(() => filterIssues("all"), 100);
  } else {
    alert("worng pass .try again");
  }
}


async function fetchIssues() {
  const container = document.getElementById("issues-container");
  if (!container) return;

  container.innerHTML = `<p class="text-center col-span-full">loading...</p>`;

  try {
    const response = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const data = await response.json();

    allIssues = Array.isArray(data) ? data : data.data || [];

    console.log("Data loaded:", allIssues); 

    updateStats();
    renderCards(allIssues);
  } catch (error) {
    console.error("Error fetching data:", error);
    container.innerHTML = `<p class="text-center col-span-full text-red-500">faild to tlad deta </p>`;
  }
}


function renderCards(issues) {
  const container = document.getElementById("issues-container");
  if (!container) return;
  container.innerHTML = "";

  if (issues.length === 0) {
    container.innerHTML = `<p class="text-center col-span-full mt-10 text-gray-400">no info found</p>`;
    return;
  }

  issues.forEach((issue) => {
    const isOpen = issue.status.toLowerCase() === "open";
    const statusColor = isOpen ? "bg-green-500" : "bg-purple-500";

  
    const topBorder = isOpen
      ? "border-t-[4px] border-t-green-500"
      : "border-t-[4px] border-t-purple-500";

    const card = document.createElement("div");
    

    card.onclick = () => showDetails(issue.id); 
    card.className = `card bg-white shadow-sm border border-gray-100 ${topBorder} rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer`;

    card.innerHTML = `
            <div class="p-5 flex flex-col h-full font-[Geist]">
                <div class="flex justify-between items-center mb-4">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center border-2 border-dashed ${isOpen ? "border-green-300" : "border-purple-300"}">
                        <div class="w-3.5 h-3.5 rounded-full ${statusColor}"></div>
                    </div>
                    <span class="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                        ${
                          issue.priority.toLowerCase() === "high"
                            ? "bg-red-50 text-red-500"
                            : issue.priority.toLowerCase() === "low"
                              ? "bg-gray-50 text-gray-500"
                              : "bg-yellow-50 text-yellow-500"
                        }">
                        ${issue.priority}
                    </span>
                </div>

                <div class="mb-4 group">
                    <h3 class="font-bold text-[#1e293b] text-lg mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        ${issue.title}
                    </h3>
                    <p class="text-gray-500 text-sm line-clamp-2">${issue.description}</p>
                </div>

                <div class="flex flex-wrap gap-2 mb-6">
                    <span class="px-3 py-1.5 bg-red-50 text-red-500 text-[9px] font-bold rounded-full border border-red-100 flex items-center gap-1">
                         <i class="fa-solid fa-bug"></i> BUG
                    </span>
                    <span class="px-3 py-1.5 bg-yellow-50 text-yellow-600 text-[9px] font-bold rounded-full border border-yellow-100 flex items-center gap-1">
                         <i class="fa-solid fa-life-ring"></i> HELP WANTED
                    </span>
                </div>

                <div class="mt-auto pt-4 border-t border-gray-100">
                    <div class="flex flex-col text-[11px] text-gray-400">
                        <span>#${issue.id} by <span class="font-semibold text-gray-600">${issue.author}</span></span>
                        <span>${new Date(issue.createdAt).toLocaleDateString("en-US")}</span>
                    </div>
                </div>
            </div>
        `;
    container.appendChild(card);
  });
}


function updateStats() {
  const total = allIssues.length;
  const openCount = allIssues.filter(
    (i) => i.status.toLowerCase() === "open",
  ).length;
  const closedCount = allIssues.filter(
    (i) => i.status.toLowerCase() === "closed",
  ).length;


  document.getElementById("total-count").innerText = `${total} Issues`;
  document.getElementById("open-count").innerText = `${openCount} Open`;
  document.getElementById("closed-count").innerText = `${closedCount} Closed`;
}

function filterIssues(status) {
  const buttonIds = ["tab-all", "tab-open", "tab-closed"];
  buttonIds.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.style.backgroundColor = "white";
      btn.style.color = "#6b7280";
      btn.style.borderColor = "#e5e7eb";
      btn.classList.remove("text-white");
      btn.classList.add("text-gray-500", "border");
    }
  });

  const activeBtn = document.getElementById(`tab-${status}`);
  if (activeBtn) {
    activeBtn.style.backgroundColor = "#641aff";
    activeBtn.style.color = "white";
    activeBtn.style.borderColor = "#641aff";
    activeBtn.classList.add("text-white");
    activeBtn.classList.remove("text-gray-500");
  }

  let filtered;
  if (status === "all") {
    filtered = allIssues;
  } else {
    filtered = allIssues.filter(
      (issue) => issue.status.toLowerCase() === status,
    );
  }

  const totalCountEl = document.getElementById("total-count");
  if (totalCountEl) {
    totalCountEl.innerText = `${filtered.length} Issues`;
  }

  renderCards(filtered);
}

// async function handleSearch() {
//   const searchText = document.getElementById("search-input").value;
//   const container = document.getElementById("issues-container");

//   if (!searchText) {
//     renderCards(allIssues);
//     return;
//   }

//   try {
//     const response = await fetch(
//       `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`,
//     );
//     const searchResult = await response.json();

//     const results = Array.isArray(searchResult)
//       ? searchResult
//       : searchResult.data || [];
//     renderCards(results);
//   } catch (error) {
//     console.error("Search failed:", error);
//   }
// }
async function handleSearch() {
    const searchText = document.getElementById("search-input").value;
    const container = document.getElementById("issues-container");

    if (!searchText) {
        renderCards(allIssues);
        updateStats();
        return;
    }
    container.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-20 gap-4">
            <span class="loading loading-spinner loading-lg text-[#641aff]"></span>
            <p class="text-gray-400 font-bold animate-pulse">Searching issues...</p>
        </div>
    `;

    try {
        const response = await fetch(
            `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`
        );
        const searchResult = await response.json();

        const results = Array.isArray(searchResult)
            ? searchResult
            : searchResult.data || [];

    
        renderCards(results);
        const totalCountEl = document.getElementById('total-count');
        if (totalCountEl) {
            totalCountEl.innerText = `${results.length} Search Results`;
        }
    } catch (error) {
        console.error("Search failed:", error);
        container.innerHTML = `<p class="text-center col-span-full text-red-500 py-10">failed to search</p>`;
    }
}

async function showDetails(id) {
    const modal = document.getElementById('issue_modal');
    const modalContent = document.getElementById('modal-content');
   
    modalContent.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 gap-4">
            <span class="loading loading-spinner loading-lg text-[#641aff]"></span>
            <p class="text-gray-400 font-bold animate-pulse">Loading details...</p>
        </div>
    `;
    modal.showModal();

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const result = await res.json();

        const issue = result.data ? result.data : result;

        if (!issue || !issue.title) {
            throw new Error("Invalid issue data");
        }

        const pColor = issue.priority?.toLowerCase() === 'high' ? 'bg-red-500' : 'bg-blue-500';
        const sColor = issue.status?.toLowerCase() === 'open' ? 'bg-[#00ba71]' : 'bg-purple-600';

        modalContent.innerHTML = `
            <div class="font-[Geist]">
                <h2 class="text-3xl font-bold text-[#1e293b] mb-4">${issue.title}</h2>
                
                <div class="flex items-center gap-3 mb-6">
                    <span class="px-4 py-1 ${sColor} text-white rounded-full text-sm font-medium">
                        ${issue.status ? issue.status.charAt(0).toUpperCase() + issue.status.slice(1) : 'Unknown'}
                    </span>
                    <span class="text-gray-400 text-sm">
                        • Opened by <span class="font-medium text-gray-600">${issue.author || 'Anonymous'}</span> 
                        • ${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                    </span>
                </div>

                <div class="flex gap-2 mb-8">
                    <span class="px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-full border border-red-100 flex items-center gap-1">
                        <i class="fa-solid fa-bug"></i> BUG
                    </span>
                    <span class="px-3 py-1 bg-yellow-50 text-yellow-600 text-xs font-bold rounded-full border border-yellow-100 flex items-center gap-1">
                        <i class="fa-solid fa-life-ring"></i> HELP WANTED
                    </span>
                </div>

                <p class="text-gray-500 leading-relaxed mb-10 text-lg">
                    ${issue.description || 'No description provided.'}
                </p>

                <div class="grid grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl">
                    <div>
                        <p class="text-gray-400 text-sm mb-2 font-medium">Assignee:</p>
                        <p class="font-bold text-gray-800 text-lg">@${issue.author || 'Not Assigned'}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-sm mb-2 font-medium">Priority:</p>
                        <span class="px-4 py-1 ${pColor} text-white text-xs font-bold rounded-full uppercase">
                            ${issue.priority || 'Medium'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Error fetching issue details:", err);
        modalContent.innerHTML = `
            <div class="text-center py-10">
                <i class="fa-solid fa-circle-exclamation text-red-500 text-4xl mb-4"></i>
                <p class="text-red-500 font-bold">failed to load data </p>
            </div>
        `;
    }
}


function changeStatus(id, newStatus) {
  const issue = allIssues.find((i) => i.id == id);
  if (issue) {
    issue.status = newStatus;
    updateStats();

    const currentTab = document
      .querySelector(".tab-active")
      .id.replace("tab-", "");
    if (currentTab === "all") {
      renderCards(allIssues);
    } else {
      filterIssues(currentTab);
    }
  }
}



