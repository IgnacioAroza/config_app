const { Dbf } = require('dbf-reader');
const fs = require('fs');

async function getAlicuotasFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

// ARTICULOS
async function getLineasFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

async function getDepositosFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

async function getGrupArticFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

async function getClaseArticFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

async function getTiposArticFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

async function getMarcasFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

// CLIENTES
async function getZonasFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

async function getListaPreciosFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

async function getGrupClienteFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

async function getTipoClienteFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

async function getClaseClienteFromDBF(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }))
        .sort((a, b) => a.codigo - b.codigo);
}

// EMPRESAS
async function getEmpresas(dbfPath) {
    const buffer = fs.readFileSync(dbfPath);
    const datatable = Dbf.read(buffer);
    return datatable.rows.map((row) => ({
        codigo: row['CODIGO'],
        nombre: row['NOMBRE']
    }));
}

module.exports = {
    // Alicuotas
    getAlicuotasFromDBF,
    // Articulos
    getDepositosFromDBF,
    getGrupArticFromDBF,
    getClaseArticFromDBF,
    getLineasFromDBF,
    getMarcasFromDBF,
    getTiposArticFromDBF,
    // Clientes
    getGrupClienteFromDBF,
    getTipoClienteFromDBF,
    getClaseClienteFromDBF,
    getZonasFromDBF,
    getListaPreciosFromDBF,
    // Empresas
    getEmpresas,
};