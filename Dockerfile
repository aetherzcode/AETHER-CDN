# Gunakan gambar resmi Node.js.
FROM node:16

# Set direktori kerja.
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json.
COPY package*.json ./

# Instal dependensi.
RUN npm install

# Salin sisa kode aplikasi.
COPY . .

# Bangun kode TypeScript.
RUN npm run build

# Ekspos port yang digunakan aplikasi.
EXPOSE 4321

# Perintah untuk menjalankan aplikasi.
CMD ["npm", "start"]
