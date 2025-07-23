import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  // Aceita apenas arquivos .xlsx
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo inválido. Apenas .xlsx é permitido'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;