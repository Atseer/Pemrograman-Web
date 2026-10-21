const INITIAL_MEMBERS = [
    { nim: "5001201001", nama: "Ahmad Rizky", prodi: "Teknik Informatika", jenis: "Mahasiswa", email: "ahmad.rizky@uni.ac.id", telepon: "081234567891", alamat: "Jl. Mawar No. 12" },
    { nim: "5001201002", nama: "Siti Sarah", prodi: "Sistem Informasi", jenis: "Mahasiswa", email: "siti.sarah@uni.ac.id", telepon: "081234567892", alamat: "Jl. Anggrek No. 45" },
    { nim: "1985031501", nama: "Dr. Budi Santoso", prodi: "Teknik Elektro", jenis: "Dosen", email: "budi.santoso@uni.ac.id", telepon: "081234567893", alamat: "Jl. Perum Dosen B-3" }
];

function getMembers() {
    const data = localStorage.getItem('library_members');
    if (!data) {
        localStorage.setItem('library_members', JSON.stringify(INITIAL_MEMBERS));
        return INITIAL_MEMBERS;
    }
    return JSON.parse(data);
}

function saveMembers(data) {
    localStorage.setItem('library_members', JSON.stringify(data));
}
 
function navigateTo(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    const targetSection = document.getElementById(`sec-${sectionId}`);
    if (targetSection) targetSection.classList.add('active');

    const targetNav = document.getElementById(`nav-${sectionId}`);
    if (targetNav) targetNav.classList.add('active');

    if (sectionId === 'members') renderMembersTable();
    if (sectionId === 'register' && document.getElementById('editIndex').value === "-1") {
        resetForm();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
 
function renderMembersTable() {
    const members = getMembers();
    const search = document.getElementById('searchInput').value.toLowerCase();
    const filter = document.getElementById('filterType').value;
    const tbody = document.getElementById('memberTableBody');
    const emptyState = document.getElementById('emptyState');

    tbody.innerHTML = '';

    const filtered = members.filter(m => {
        const matchSearch = m.nama.toLowerCase().includes(search) || m.nim.toLowerCase().includes(search);
        const matchFilter = filter === '' || m.jenis === filter;
        return matchSearch && matchFilter;
    });

    if (filtered.length === 0) {
        emptyState.classList.remove('d-none');
    } else {
        emptyState.classList.add('d-none');
        filtered.forEach((member, idx) => {
            const originalIndex = members.findIndex(m => m.nim === member.nim);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="ps-3 font-monospace text-muted small">${idx + 1}</td>
                <td class="fw-semibold">${member.nim}</td>
                <td>${member.nama}</td>
                <td>${member.prodi}</td>
                <td><span class="badge ${getBadgeClass(member.jenis)}">${member.jenis}</span></td>
                <td class="small text-muted">${member.email}</td>
                <td class="text-center">
                    <div class="action-btn-group">
                        <button class="btn-action btn-action-view" onclick="viewDetail(${originalIndex})" title="Lihat Detail">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-action btn-action-edit" onclick="editMember(${originalIndex})" title="Edit Data">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-action btn-action-delete" onclick="deleteMember(${originalIndex})" title="Hapus Data">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function getBadgeClass(type) {
    if (type === 'Mahasiswa') return 'bg-primary-subtle text-primary';
    if (type === 'Dosen') return 'bg-success-subtle text-success';
    return 'bg-warning-subtle text-warning';
}
 
function handleFormSubmit(e) {
    e.preventDefault();
    const members = getMembers();
    const editIdx = parseInt(document.getElementById('editIndex').value);

    const nimVal = document.getElementById('nim').value.trim();
    const emailVal = document.getElementById('email').value.trim();
 
    const duplicateIndex = members.findIndex(m => m.nim === nimVal);
    if (duplicateIndex !== -1 && duplicateIndex !== editIdx) {
        alert('NIM/NIP ini sudah terdaftar dalam sistem!');
        return;
    }

    const memberData = {
        nim: nimVal,
        nama: document.getElementById('nama').value.trim(),
        jenis: document.getElementById('jenis').value,
        prodi: document.getElementById('prodi').value.trim(),
        email: emailVal,
        telepon: document.getElementById('telepon').value.trim(),
        alamat: document.getElementById('alamat').value.trim()
    };

    if (editIdx === -1) {
        members.push(memberData);
        showAlert('Anggota baru berhasil didaftarkan!', 'success');
    } else {
        members[editIdx] = memberData;
        showAlert('Data anggota berhasil diperbarui!', 'info');
    }

    saveMembers(members);
    resetForm();
    navigateTo('members');
}

function viewDetail(index) {
    const member = getMembers()[index];
    document.getElementById('detNim').textContent = member.nim;
    document.getElementById('detNama').textContent = member.nama;
    document.getElementById('detJenis').textContent = member.jenis;
    document.getElementById('detProdi').textContent = member.prodi;
    document.getElementById('detEmail').textContent = member.email;
    document.getElementById('detTelepon').textContent = member.telepon;
    document.getElementById('detAlamat').textContent = member.alamat;

    const modal = new bootstrap.Modal(document.getElementById('detailModal'));
    modal.show();
}

function editMember(index) {
    const member = getMembers()[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('nim').value = member.nim;
    document.getElementById('nama').value = member.nama;
    document.getElementById('jenis').value = member.jenis;
    document.getElementById('prodi').value = member.prodi;
    document.getElementById('email').value = member.email;
    document.getElementById('telepon').value = member.telepon;
    document.getElementById('alamat').value = member.alamat;

    document.getElementById('formTitle').textContent = 'Edit Data Anggota';
    document.getElementById('btnSubmit').innerHTML = '<i class="fa-solid fa-floppy-disk me-2"></i>Simpan Perubahan';

    navigateTo('register');
}

function deleteMember(index) {
    const member = getMembers()[index];
    if (confirm(`Apakah Anda yakin ingin menghapus data anggota "${member.nama}" (${member.nim})?`)) {
        const members = getMembers();
        members.splice(index, 1);
        saveMembers(members);
        showAlert('Data anggota berhasil dihapus.', 'danger');
        renderMembersTable();
    }
}

function resetForm() {
    document.getElementById('registrationForm').reset();
    document.getElementById('editIndex').value = "-1";
    document.getElementById('formTitle').textContent = "Formulir Pendaftaran Anggota";
    document.getElementById('btnSubmit').innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>Simpan & Daftar';
}

function showAlert(msg, type) {
    const alertBox = document.getElementById('alertBox');
    const alertText = document.getElementById('alertText');
    alertBox.className = `alert alert-${type} alert-dismissible fade show`;
    alertText.textContent = msg;
    alertBox.classList.remove('d-none');
}

function closeAlert() {
    document.getElementById('alertBox').classList.add('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
    getMembers();
});