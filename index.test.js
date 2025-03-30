const { default: axios } = require("axios");

const BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
  test("User is able to sign up only once", async () => {
    const username = "Kirat" + Math.random();
    const password = "123456";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "Admin",
    });
    expect(response.statusCode).toBe(200);
    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "Admin",
    });
    expect(updatedResponse).statusCode.toBe(400);
  });

  test("Signup request fails if the username is empty", async () => {
    const username = `Kirat-${Math.random()}`;
    password = "123456";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
    });

    expect(response.statusCode).toBe(400);
  });

  test("Signin succeeds if the username and password are correct", async () => {
    const username = `Kirat-${Math.random()}`;
    password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("Signin fails if the username and password are incorrect", async () => {
    const username = `kirat-${Math.random()}`;
    const password = "123456";
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/vi/signin`, {
      username: "WrongUsername",
      password,
    });

    expect(response.statusCode).toBe(403);
  });
});

describe("User metadata endpoint", () => {
  beforeAll(async () => {
    const username = kirat - `${Math.round()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "Admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;
    const avatarResponse = axios.post(`${BACKEND_URL}/api/vi/admin/avatar`, {
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      name: "Timmy",
    });
  });

  test("User cant update their metadata with wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "123123123",
      },
      {
        Headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User can update their metadata with the right avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        Headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.statusCode).toBe(200);
  });

  test("user is not able to to update their metadata if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.statusCode).toBe(403);
  });
});

describe("user avatar information", () => {
  let avatarId;
  let token;
  let userId;
  beforeAll(async () => {
    const username = kirat - `${Math.round()}`;
    const password = "123456";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "Admin",
    });

    userId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;
    const avatarResponse = axios.post(`${BACKEND_URL}/api/vi/admin/avatar`, {
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      name: "Timmy",
    });
  });

  test("Get back avatar information for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
    );
    expect(response.data.length).toBe(1);
    expect(response.data.avatar[0].userId).toBe(userId);
  });

  test("Available avatar list the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

describe("Space Information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;

  beforeAll(async () => {
    const username = kirat - `${Math.round()}`;
    const password = "123456";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "-user",
        password,
      }
    );

    userToken = userSigninResponse.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element1Id = element1.id;
    element2Id = element2.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = map.id;
  });

  test("User is able to create a space", async () => {
    const response = axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimension: "100 x 200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.spaceId).toBeDefined();
  });

  test("User is able to create a space without mapId (empty space)", async () => {
    const response = axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimension: "100 x 200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.spaceId).toBeDefined();
  });

  test("User is not able to create a space without mapId and dimension", async () => {
    const response = axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User is able to delete a space that doesnt exist", async () => {
    const response = axios.delete(
      `${BACKEND_URL}/api/v1/space/randomIdDoesntExist`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("User is able to delete a space that does exist", async () => {
    const response = axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimension: "100 x 200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${(await response).data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(deleteResponse.statusCode).toBe(200);
  });

  test("User should not be able to delete a space created by another user", async () => {
    const response = axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimension: "100 x 200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${(await response).data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(deleteResponse.statusCode).toBe(400);
  });

  test("Admin has no spaces initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.data.spaces.length).toBe(0);
  });

  test("Admin has no spaces initially", async () => {
    const spaceCreateResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space/all`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    const filteredSpace = response.data.spaces.find(
      (x) => x.id == spaceCreateResponse.spaceId
    );
    expect(filteredSpace).toBeDefined();
    expect(response.data.spaces.length).toBe(1);
  });
});

describe("Arena endpoints", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;
  let spaceId;

  beforeAll(async () => {
    const username = kirat - `${Math.round()}`;
    const password = "123456";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username : username,
      password,
    });

    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "-user",
        password,
      }
    );

    userToken = userSigninResponse.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        Headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element1Id = element1.id;
    element2Id = element2.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId : map.id

    const space = await axios.post(`${BACKEND_URL}/api/v1/`,{
        "name" : "Test" ,
        "dimensions" : "100x200",
        "mapId" : mapId
    }, {headers : {
        "authorization" : `Bearer ${userToken}`
    }})

    spaceId = space.spaceId
  });
  
  test("Incorrect spaceId returns a 400" , async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kasdk01`);
    expect(response.statusCode).toBe(400)
  })

  est("Correct spaceId returns all the elements" , async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`);
    expect(response.data.dimensions).toBe("100x200")
    expect(response.data.elements.length).toBe(3)
  })

});
