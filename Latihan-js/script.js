 function switchTab(tabId) { 
    document.getElementById('kodePosTab').style.display = 'none';
    document.getElementById('emailTab').style.display = 'none';
 
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
 
    document.getElementById(tabId).style.display = 'block';
 
    event.currentTarget.classList.add('active');
} 
const dataWilayah = {
    "Jawa Timur": {
        "Kota Surabaya": {
            "Sukolilo": "60111",
            "Gubeng": "60281"
        },
        "Kota Malang": {
            "Lowokwaru": "65141"
        }
    },
    "DKI Jakarta": {
        "Jakarta Selatan": {
            "Kebayoran Baru": "12110"
        }
    }
};

const selectProvinsi = document.getElementById('provinsi');
const selectKabupaten = document.getElementById('kabupaten');
const selectKecamatan = document.getElementById('kecamatan');
const resultBox = document.getElementById('resultBox');
 
for (let prov in dataWilayah) {
    let option = document.createElement('option');
    option.value = prov;
    option.textContent = prov;
    selectProvinsi.appendChild(option);
} 
selectProvinsi.addEventListener('change', function() {
    selectKabupaten.innerHTML = '<option value="">-- Pilih Kabupaten / Kota --</option>';
    selectKecamatan.innerHTML = '<option value="">-- Pilih Kecamatan --</option>';
    selectKabupaten.disabled = true;
    selectKecamatan.disabled = true;
    resultBox.style.display = 'none';

    if (this.value) {
        selectKabupaten.disabled = false;
        for (let kab in dataWilayah[this.value]) {
            let option = document.createElement('option');
            option.value = kab;
            option.textContent = kab;
            selectKabupaten.appendChild(option);
        }
    }
});
 
selectKabupaten.addEventListener('change', function() {
    selectKecamatan.innerHTML = '<option value="">-- Pilih Kecamatan --</option>';
    selectKecamatan.disabled = true;
    resultBox.style.display = 'none';

    if (this.value) {
        selectKecamatan.disabled = false;
        let kecList = dataWilayah[selectProvinsi.value][this.value];
        for (let kec in kecList) {
            let option = document.createElement('option');
            option.value = kec;
            option.textContent = kec;
            selectKecamatan.appendChild(option);
        }
    }
});
 
selectKecamatan.addEventListener('change', function() {
    if (this.value) {
        let kode = dataWilayah[selectProvinsi.value][selectKabupaten.value][this.value];
        document.getElementById('outProvinsi').textContent = selectProvinsi.value;
        document.getElementById('outKabupaten').textContent = selectKabupaten.value;
        document.getElementById('outKecamatan').textContent = this.value;
        document.getElementById('outKodePos').textContent = kode;
        resultBox.style.display = 'block';
    } else {
        resultBox.style.display = 'none';
    }
});
 
document.getElementById('submitEmail').addEventListener('click', function() {
    const email = document.getElementById('emailInput').value;
    const resultP = document.getElementById('emailResult');
     
    if (email.includes('@') && email.includes('.')) {
        resultP.style.color = 'green';
        resultP.textContent = `Email "${email}" valid!`;
    } else {
        resultP.style.color = 'red';
        resultP.textContent = 'Format email tidak valid. Pastikan mengandung "@" dan "."';
    }
});