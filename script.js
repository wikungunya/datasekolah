// Dummy Data Struktur (Sesuaikan key ini dengan header kolom JSON Spreadsheet Anda nanti)
let siswaData = [
    { no: 1, nama: "Adam Iqbal Zahid", nik: "3304172503140002", tempatLahir: "Banjarnegara", tanggalLahir: "25 Maret 2014", kelas: "Kelas 6", nisn: "0147263229", nis: "1343", alamat: "Karangtengah, RT.1/3", ayah: "Karwoto", ibu: "Siti" },
    { no: 2, nama: "Budi Setiawan", nik: "3304172503140003", tempatLahir: "Banjarnegara", tanggalLahir: "12 April 2014", kelas: "Kelas 5", nisn: "0147263230", nis: "1344", alamat: "Pandansari, RT.2/1", ayah: "Ahmad", ibu: "Aminah" },
    { no: 3, nama: "Citra Lestari", nik: "3304172503140004", tempatLahir: "Purbalingga", tanggalLahir: "05 Mei 2015", kelas: "Kelas 6", nisn: "0147263231", nis: "1345", alamat: "Karangtengah, RT.3/3", ayah: "Supardi", ibu: "Ratna" },
    // Tambahkan tiruan data lain untuk uji coba pagination...
];

// State Management
let dataFilter tetap = [...siswaData]; 
let currentPage = 1;
let rowsPerPage = 10;

// DOM Elements
const tableBody = document.getElementById('tableBody');
const filterKelas = document.getElementById('filterKelas');
const filterNama = document.getElementById('filterNama');
const searchCepat = document.getElementById('searchCepat');
const entriesPerPage = document.getElementById('entriesPerPage');
const totalSiswaEl = document.getElementById('totalSiswa');
const paginationEl = document.getElementById('pagination');
const btnReset = document.getElementById('btnReset');

// Init App
document.addEventListener("DOMContentLoaded", () => {
    populateFilterOptions();
    applyFilters();
    
    // Add Event Listeners
    filterKelas.addEventListener('change', applyFilters);
    filterNama.addEventListener('change', applyFilters);
    searchCepat.addEventListener('input', applyFilters);
    entriesPerPage.addEventListener('change', () => {
        rowsPerPage = parseInt(entriesPerPage.value);
        currentPage = 1;
        renderTable();
    });
    
    btnReset.addEventListener('click', resetFilters);
});

// Memasukkan pilihan option secara otomatis berdasarkan data yang ada
function populateFilterOptions() {
    const kelasSet = new Set();
    const namaSet = new Set();

    siswaData.forEach(siswa => {
        if(siswa.kelas) kelasSet.add(siswa.kelas);
        if(siswa.nama) namaSet.add(siswa.nama);
    });

    // Sort dan masukkan ke select kelas
    Array.from(kelasSet).sort().forEach(kelas => {
        let opt = document.createElement('option');
        opt.value = kelas;
        opt.textContent = kelas;
        filterKelas.appendChild(opt);
    });

    // Sort dan masukkan ke select nama
    Array.from(namaSet).sort().forEach(nama => {
        let opt = document.createElement('option');
        opt.value = nama;
        opt.textContent = nama;
        filterNama.appendChild(opt);
    });
}

// Logika pemfilteran gabungan (Kelas + Nama + Input Text)
function applyFilters() {
    const valKelas = filterKelas.value.toLowerCase();
    const valNama = filterNama.value.toLowerCase();
    const querySearch = searchCepat.value.toLowerCase();

    dataFilter = siswaData.filter(siswa => {
        const matchKelas = valKelas === "" || siswa.kelas.toLowerCase() === valKelas;
        const matchNama = valNama === "" || siswa.nama.toLowerCase() === valNama;
        
        // Pencarian global mencakup nama, NIK, NISN, Alamat
        const matchSearch = querySearch === "" || 
            siswa.nama.toLowerCase().includes(querySearch) ||
            siswa.nik.includes(querySearch) ||
            siswa.nisn.includes(querySearch) ||
            siswa.alamat.toLowerCase().includes(querySearch);

        return matchKelas && matchNama && matchSearch;
    });

    currentPage = 1; // Kembalikan ke halaman pertama setiap kali filter berubah
    totalSiswaEl.textContent = dataFilter.length;
    renderTable();
}

// Render isi tabel berdasarkan pagination
function renderTable() {
    tableBody.innerHTML = "";
    
    if (dataFilter.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="11" class="text-center" style="padding: 30px; color: #94a3b8;">Tidak ada data yang cocok.</td></tr>`;
        paginationEl.innerHTML = "";
        return;
    }

    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;
    let paginatedItems = dataFilter.slice(start, end);

    paginatedItems.forEach((siswa, index) => {
        let row = `
            <tr>
                <td class="text-center">${start + index + 1}</td>
                <td style="font-weight: 500; color: #1e293b;">${siswa.nama}</td>
                <td>${siswa.nik}</td>
                <td>${siswa.tempatLahir}</td>
                <td>${siswa.tanggalLahir}</td>
                <td>${siswa.kelas}</td>
                <td>${siswa.nisn}</td>
                <td>${siswa.nis}</td>
                <td>${siswa.alamat}</td>
                <td>${siswa.ayah}</td>
                <td>${siswa.ibu}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    renderPaginationControls();
}

// Membuat button nomor halaman di footer tabel
function renderPaginationControls() {
    paginationEl.innerHTML = "";
    let pageCount = Math.ceil(dataFilter.length / rowsPerPage);
    
    if(pageCount <= 1) return;

    for (let i = 1; i <= pageCount; i++) {
        let btn = document.createElement('button');
        btn.classList.add('page-link');
        if(i === currentPage) btn.classList.add('active');
        btn.textContent = i;
        
        btn.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        
        paginationEl.appendChild(btn);
    }
}

// Fungsi tombol reset
function resetFilters() {
    filterKelas.value = "";
    filterNama.value = "";
    searchCepat.value = "";
    applyFilters();
}
