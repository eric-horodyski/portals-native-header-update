interface User {
  name: {
    first: string;
    last: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
  };
  picture: {
    thumbnail: string;
    small: string;
    large: string;
  };
  uuid: string;
}
export default User;
