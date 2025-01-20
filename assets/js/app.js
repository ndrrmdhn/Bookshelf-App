document.addEventListener("DOMContentLoaded", () => {
  const judulBukuInput = document.getElementById("judul-buku");
  const statusBukuSelect = document.getElementById("status-buku");
  const gambarBukuInput = document.getElementById("gambar-buku");
  const tambahBukuButton = document.getElementById("tambah-buku");
  const daftarBukuBelumSelesai = document.getElementById(
    "daftar-buku-belum-selesai"
  );
  const daftarBukuSelesai = document.getElementById("daftar-buku-selesai");

  const KUNCI_STORAGE = "data-rak-buku";

  const ambilBuku = () => JSON.parse(localStorage.getItem(KUNCI_STORAGE)) || [];

  const simpanBuku = (buku) =>
    localStorage.setItem(KUNCI_STORAGE, JSON.stringify(buku));

  const tampilkanBuku = () => {
    daftarBukuBelumSelesai.innerHTML = "";
    daftarBukuSelesai.innerHTML = "";

    const buku = ambilBuku();
    buku.forEach((bukuItem, index) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const img = document.createElement("img");
      img.src = bukuItem.gambar || "/assets/img/default.jpg";
      img.alt = `Sampul ${bukuItem.judul}`;
      img.classList.add("card-img");

      const title = document.createElement("h3");
      title.textContent = bukuItem.judul;
      title.classList.add("card-title");

      const status = document.createElement("p");
      status.textContent = `Status: ${
        bukuItem.status === "belum-selesai" ? "Belum Selesai" : "Selesai"
      }`;
      status.classList.add("card-status");

      const editButton = document.createElement("button");
      editButton.textContent = "Ubah Gambar";
      editButton.classList.add("edit-button");
      editButton.addEventListener("click", () => ubahGambar(index));

      const pindahButton = document.createElement("button");
      pindahButton.textContent = "Pindah";
      pindahButton.classList.add("pindah");
      pindahButton.addEventListener("click", () => pindahBuku(index));

      const hapusButton = document.createElement("button");
      hapusButton.textContent = "Hapus";
      hapusButton.classList.add("hapus");
      hapusButton.addEventListener("click", () => hapusBuku(index));

      card.append(img, title, status, editButton, pindahButton, hapusButton);

      if (bukuItem.status === "belum-selesai") {
        daftarBukuBelumSelesai.appendChild(card);
      } else {
        daftarBukuSelesai.appendChild(card);
      }
    });
  };

  const tambahBuku = () => {
    const judul = judulBukuInput.value.trim();
    const status = statusBukuSelect.value;
    const gambarFile = gambarBukuInput.files[0];

    if (!judul) {
      alert("Judul buku tidak boleh kosong!");
      return;
    }

    if (gambarFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const buku = ambilBuku();
        buku.push({ judul, status, gambar: fileReader.result });
        simpanBuku(buku);

        judulBukuInput.value = "";
        gambarBukuInput.value = null;
        tampilkanBuku();
      };
      fileReader.readAsDataURL(gambarFile);
    } else {
      const buku = ambilBuku();
      buku.push({ judul, status, gambar: null });
      simpanBuku(buku);

      judulBukuInput.value = "";
      gambarBukuInput.value = null;
      tampilkanBuku();
    }
  };

  const pindahBuku = (index) => {
    const buku = ambilBuku();
    buku[index].status =
      buku[index].status === "belum-selesai" ? "selesai" : "belum-selesai";
    simpanBuku(buku);
    tampilkanBuku();
  };

  const hapusBuku = (index) => {
    const buku = ambilBuku();
    buku.splice(index, 1);
    simpanBuku(buku);
    tampilkanBuku();
  };

  const ubahGambar = (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", () => {
      const buku = ambilBuku();
      if (fileInput.files[0]) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          buku[index].gambar = fileReader.result;
          simpanBuku(buku);
          tampilkanBuku();
        };
        fileReader.readAsDataURL(fileInput.files[0]);
      }
    });
    fileInput.click();
  };

  tambahBukuButton.addEventListener("click", tambahBuku);
  tampilkanBuku();
});
