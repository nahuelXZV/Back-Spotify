

export const imagenFilter = (req: Express.Request, imagen: Express.Multer.File, callback: Function) => {
    if (!imagen) return callback(new Error('imagen is empty'), false);
    // const imagenExptension = imagen.mimetype.split('/')[1];
    // const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    // if (validExtensions.includes(imagenExptension)) {
    //     return callback(null, true)
    // }
    callback(null, true);
}
