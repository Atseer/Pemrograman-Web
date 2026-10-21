const initialStudents = [
    { id: 1, nim: '230101001', name: 'Ahmad Rizky', major: 'Teknik Informatika', email: 'ahmad@student.ac.id', gender: 'Laki-laki', year: '2023' },
    { id: 2, nim: '230101002', name: 'Siti Sarah', major: 'Sistem Informasi', email: 'siti@student.ac.id', gender: 'Perempuan', year: '2023' },
    { id: 3, nim: '220101015', name: 'Budi Santoso', major: 'Teknik Komputer', email: 'budi@student.ac.id', gender: 'Laki-laki', year: '2022' },
    { id: 4, nim: '240101008', name: 'Dewi Lestari', major: 'Data Science', email: 'dewi@student.ac.id', gender: 'Perempuan', year: '2024' },
    { id: 5, nim: '210101030', name: 'Eko Prasetyo', major: 'Desain Komunikasi Visual', email: 'eko@student.ac.id', gender: 'Laki-laki', year: '2021' }
]; 
let students = JSON.parse(localStorage.getItem('students_data')) || initialStudents;
let currentPage = 1;
const itemsPerPage = 5;
let searchQuery = '';
let deleteTargetId = null;
 
const studentForm = document.getElementById('student-form');
const formTitle = document.getElementById('form-title');
const studentIdInput = document.getElementById('student-id');
const nimInput = document.getElementById('nim');
const nameInput = document.getElementById('name');
const majorInput = document.getElementById('major');
const emailInput = document.getElementById('email');
const genderInput = document.getElementById('gender');
const yearInput = document.getElementById('year');
const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');

const tableBody = document.getElementById('student-table-body');
const searchInput = document.getElementById('search-input');
const totalInfo = document.getElementById('total-info');
const pagination = document.getElementById('pagination');

const modalOverlay = document.getElementById('modal-overlay');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');
const btnCancelDelete = document.getElementById('btn-cancel-delete');
 
function saveData() {
    localStorage.setItem('students_data', JSON.stringify(students));
} 
function renderTable() {
    // Filter berdasarkan pencarian
    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.major.toLowerCase().includes(searchQuery.toLowerCase())
    );
 
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);
 
    tableBody.innerHTML = '';

    if (paginated.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fa-regular fa-folder-open" style="font-size: 2rem; margin-bottom: 8px; display: block;"></i>
                    Data mahasiswa tidak ditemukan.
                </td>
            </tr>
        `;
    } else {
        paginated.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${start + index + 1}</td>
                <td><strong>${item.nim}</strong></td>
                <td>${item.name}</td>
                <td>${item.major}</td>
                <td>${item.email}</td>
                <td>${item.year}</td>
                <td>
                    <div class="actions">
                        <button class="action edit" onclick="handleEdit(${item.id})" title="Edit Data">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="action delete" onclick="openDeleteModal(${item.id})" title="Hapus Data">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }
 
    totalInfo.textContent = `Menampilkan ${paginated.length} dari ${totalItems} Mahasiswa`;
    renderPagination(totalPages);
}
 
function renderPagination(totalPages) {
    pagination.innerHTML = '';
 
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { currentPage--; renderTable(); };
    pagination.appendChild(prevBtn);
 
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.onclick = () => { currentPage = i; renderTable(); };
        pagination.appendChild(btn);
    }
 
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { currentPage++; renderTable(); };
    pagination.appendChild(nextBtn);
}
 
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = studentIdInput.value;
    const studentData = {
        id: id ? parseInt(id) : Date.now(),
        nim: nimInput.value,
        name: nameInput.value,
        major: majorInput.value,
        email: emailInput.value,
        gender: genderInput.value,
        year: yearInput.value
    };

    if (id) { 
        const index = students.findIndex(s => s.id === parseInt(id));
        if (index !== -1) students[index] = studentData;
    } else { 
        students.unshift(studentData);
    }

    saveData();
    resetForm();
    renderTable();
});
 
window.handleEdit = function(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    studentIdInput.value = student.id;
    nimInput.value = student.nim;
    nameInput.value = student.name;
    majorInput.value = student.major;
    emailInput.value = student.email;
    genderInput.value = student.gender;
    yearInput.value = student.year;

    formTitle.innerHTML = '<i class="fa-solid fa-user-pen"></i> Edit Mahasiswa';
    btnSave.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Update Data';
    btnCancel.style.display = 'inline-flex';
     
    window.scrollTo({ top: 0, behavior: 'smooth' });
}; 
function resetForm() {
    studentForm.reset();
    studentIdInput.value = '';
    formTitle.innerHTML = '<i class="fa-solid fa-user-plus"></i> Tambah Mahasiswa';
    btnSave.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Data';
    btnCancel.style.display = 'none';
}

btnCancel.addEventListener('click', resetForm);
 
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    currentPage = 1;
    renderTable();
});
 
window.openDeleteModal = function(id) {
    deleteTargetId = id;
    modalOverlay.classList.add('active');
};

btnCancelDelete.addEventListener('click', () => {
    deleteTargetId = null;
    modalOverlay.classList.remove('active');
});

btnConfirmDelete.addEventListener('click', () => {
    if (deleteTargetId !== null) {
        students = students.filter(s => s.id !== deleteTargetId);
        saveData();
        renderTable();
        deleteTargetId = null;
    }
    modalOverlay.classList.remove('active');
});
 
renderTable();