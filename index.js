import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const tanggalSekarang = new Date();
const opsiTanggal = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};
const opsiWaktu = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short'
};

// Menentukan waktu untuk WIB, WITA, dan WIT
const tanggalSekarangWIB = new Date(tanggalSekarang.getTime() + (7 * 60 * 60 * 1000));
const tanggalSekarangWITA = new Date(tanggalSekarang.getTime() + (8 * 60 * 60 * 1000));
const tanggalSekarangWIT = new Date(tanggalSekarang.getTime() + (9 * 60 * 60 * 1000));

// Format tanggal dan waktu untuk WIB, WITA, dan WIT
const tanggalFormatWIB = tanggalSekarangWIB.toLocaleDateString('id-ID', opsiTanggal);
const waktuFormatWIB = tanggalSekarangWIB.toLocaleTimeString('id-ID', opsiWaktu);
const tanggalDanWaktuWIB = `${tanggalFormatWIB} ${waktuFormatWIB}`;

const tanggalFormatWITA = tanggalSekarangWITA.toLocaleDateString('id-ID', opsiTanggal);
const waktuFormatWITA = tanggalSekarangWITA.toLocaleTimeString('id-ID', opsiWaktu);
const tanggalDanWaktuWITA = `${tanggalFormatWITA} ${waktuFormatWITA}`;

const tanggalFormatWIT = tanggalSekarangWIT.toLocaleDateString('id-ID', opsiTanggal);
const waktuFormatWIT = tanggalSekarangWIT.toLocaleTimeString('id-ID', opsiWaktu);
const tanggalDanWaktuWIT = `${tanggalFormatWIT} ${waktuFormatWIT}`;

async function updateReadme(contentSection) {
  try {
    const filePath = path.join(process.cwd(), 'README.md');
    if (!fs.existsSync(filePath)) {
      console.error('File README.md tidak ditemukan di path:', filePath);
      return;
    }

    let readmeContent = fs.readFileSync(filePath, 'utf8');
    const regex = /<!-- START_SECTION:quote -->[\s\S]*<!-- END_SECTION:quote -->/;
    const replacement = `<!-- START_SECTION:quote -->\n${contentSection}\n<!-- END_SECTION:quote -->`;

    if (regex.test(readmeContent)) {
      readmeContent = readmeContent.replace(regex, replacement);
      fs.writeFileSync(filePath, readmeContent, 'utf8');
      console.log('README.md berhasil diperbarui secara aman!');
    } else {
      console.error('Tag placeholder <!-- START_SECTION:quote --> tidak ditemukan di README.md');
    }
  } catch (error) {
    console.error('Gagal menulis ke README.md:', error);
  }
}

async function ambilKutipan() {
  let contentSection = '';
  try {
    const response = await fetch('https://quote-generator-api-six.vercel.app/api/quotes/random');
    const data = await response.json();
    if (data.status) {
      const kutipan = data.quote;
      const kategori = data.category;
      contentSection = `⏰ Diperbarui pada:
- WIB: ${tanggalDanWaktuWIB}
- WITA: ${tanggalDanWaktuWITA}
- WIT: ${tanggalDanWaktuWIT}

Kutipan Inspiratif:
"${kutipan}"

Kategori: ${kategori}`;
    } else {
      console.error('Gagal mendapatkan kutipan dari API');
      contentSection = `⏰ Diperbarui pada:
- WIB: ${tanggalDanWaktuWIB}
- WITA: ${tanggalDanWaktuWITA}
- WIT: ${tanggalDanWaktuWIT}

Kutipan Inspiratif:
Tidak dapat memuat kutipan saat ini.`;
    }
  } catch (error) {
    console.error('Terjadi kesalahan koneksi/API:', error);
    contentSection = `⏰ Diperbarui pada:
- WIB: ${tanggalDanWaktuWIB}
- WITA: ${tanggalDanWaktuWITA}
- WIT: ${tanggalDanWaktuWIT}

Kutipan Inspiratif:
Tidak dapat memuat kutipan saat ini.`;
  }

  await updateReadme(contentSection);
}

ambilKutipan();
