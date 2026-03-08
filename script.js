
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

  container.innerHTML = `<p class="text-center col-span-full">লোড হচ্ছে...</p>`;

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
    container.innerHTML = `<p class="text-center col-span-full mt-10 text-gray-400">কোনো তথ্য পাওয়া যায়নি!</p>`;
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