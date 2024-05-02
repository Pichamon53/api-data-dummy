import axios, { AxiosResponse } from 'axios';
import { IncomingMessage, ServerResponse } from 'http';
import { createServer } from 'http';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  hair: {
    color: string;
    type: string;
  };
  department: string;
  address: {
    address: string;
    city: string;
    postalCode: string;
  };
}

interface UsersByDepartment {
  [department: string]: {
    male: number;
    female: number;
    ageRange: string;
    hair: { [color: string]: number };
    addressUser: { [key: string]: string };
  };
}

class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchError';
  }
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const response: AxiosResponse<{ users: User[] }> = await axios.get('https://dummyjson.com/users');
    if (response.data && Array.isArray(response.data.users)) {
      return response.data.users;
    } else {
      throw new FetchError('Invalid data structure received from API');
    }
  } catch (error) {
    if (error instanceof FetchError) {
      console.error('Failed to fetch users:', error.message);
    } else if (error instanceof Error) {
      console.error('Failed to fetch users:', error.message);
    } else {
      console.error('Failed to fetch users and the error did not have a message property.');
    }
    throw error; // Re-throw the error to be handled by the caller
  }
}

export function transformUsersData(users: User[]): UsersByDepartment {
  const departmentData: UsersByDepartment = {};

  users.forEach((user) => {
    const { department, gender, age, hair, firstName, lastName, address } = user;

    // Normalize hair color with a fallback
    const normalizedHairColor = [
      "Black",
      "Blond",
      "Chestnut",
      "Brown",
    ].includes(hair.color)
      ? hair.color
      : "Other";

    if (!departmentData[department]) {
      departmentData[department] = {
        male: 0,
        female: 0,
        ageRange: `${age}-${age}`,
        hair: {
          Black: 0,
          Blond: 0,
          Chestnut: 0,
          Brown: 0,
          Other: 0,
        },
        addressUser: {},
      };
    }

    const dept = departmentData[department];
    if (gender.toLowerCase() === 'male') {
      dept.male += 1;
    } else if (gender.toLowerCase() === 'female') {
      dept.female += 1;
    }

    let [minAge, maxAge] = dept.ageRange.split('-').map(Number);
    dept.ageRange = `${Math.min(minAge, age)}-${Math.max(maxAge, age)}`;

    dept.hair[normalizedHairColor] += 1;
    dept.addressUser[`${firstName}${lastName}`] = address.postalCode;
  });

  return departmentData;
}

async function startServer() {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === '/users') {
      try {
        const users = await fetchUsers();
        const usersByDepartment = transformUsersData(users);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(usersByDepartment));
      } catch (error) {
        res.statusCode = 500;
        res.end('Error fetching users');
      }
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  });

  server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}

startServer();
