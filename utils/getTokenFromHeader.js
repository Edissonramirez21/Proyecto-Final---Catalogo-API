export const getTokenFromHeader = (req) => {
    //get token from header
    const token = req?.headers?.authorization?.split(" ")[1];
    if (token === undefined) {
      return "No se ha encontrado ningún token en la cabecera";
    } else {
      return token;
    }
  };
  