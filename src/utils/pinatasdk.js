import axios from "axios";
import { NFTStorage } from "nft.storage";

const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;

const PINATA_JWT = `Bearer ${process.env.REACT_APP_PINATA_JWT}`;

export const UPLOADING_FILE_TYPES = {
  OTHERS: 0,
  JSON: 1,
};

/* Pinata */

export const pinFileToPinata = async (file) => {
  let ipfsCid = "";
  try {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: PINATA_JWT,
        },
      }
    );
    ipfsCid = res.data.IpfsHash;
  } catch (error) {
    ipfsCid = null;
  }
  return ipfsCid;
};

export const pinMultiFilesToPinata = async (
  filelist,
  type = UPLOADING_FILE_TYPES.IMAGE
) => {
  let ipfsCid = "";
  try {
    if (filelist?.length <= 0) return null;
    const formData = new FormData();

    Array.from(filelist).forEach((file) => {
      formData.append("file", file);
    });

    const metadata = JSON.stringify({
      name: `${type}_${Date.now()}`,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: PINATA_JWT,
          },
        }
      );
      ipfsCid = res.data.IpfsHash;
    } catch (error) {
      ipfsCid = null;
    }
  } catch (error) {
    ipfsCid = null;
  }

  return ipfsCid;
};

export const pinJsonToPinata = async (jsonObj) => {
  let ipfsCid = "";
  try {
    let res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      { ...jsonObj },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: PINATA_JWT,
        },
      }
    );
    ipfsCid = res.data.IpfsHash;
  } catch (error) {
    ipfsCid = null;
  }
  return ipfsCid;
};

export const pinUpdatedJsonDirectoryToPinata = async (
  namelist,
  jsonlist,
  type = UPLOADING_FILE_TYPES.IMAGE
) => {
  let ipfsCid = "";
  try {
    if (jsonlist?.length <= 0) return null;
    let formData = new FormData();
    for (let idx = 0; idx < jsonlist.length; idx++) {
      formData.append(
        "file",
        new Blob([jsonlist[idx]], { type: "application/json" }),
        `json/${namelist[idx].name}`
      );
    }

    const metadata = JSON.stringify({
      name: `${type}_${Date.now()}`,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: PINATA_JWT,
          },
        }
      );
      ipfsCid = res.data.IpfsHash;
    } catch (error) {
      ipfsCid = null;
    }
  } catch (error) {
    ipfsCid = null;
  }

  return ipfsCid;
};

/* NFT Storage */

export const pinFileToNFTStorage = async (file, description) => {
  const storage = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const metadata = await storage.store({
    name: file.name.toLowerCase() || "",
    description: description || "",
    image: file
  })
  // console.log(metadata.data)
  return metadata.data.image.href.replace("ipfs://", "https://nftstorage.link/ipfs/");

  // const formData = new FormData();
  // formData.append("file", file);

  // const metadata = JSON.stringify({
  //   name: file.name || "File name",
  // });
  // formData.append("nftStorageMetadata", metadata);

  // const options = JSON.stringify({
  //   cidVersion: 0,
  // });
  // formData.append("nftStorageOptions", options);

  // const res = await axios.post(
  //   "https://api.nft.storage/upload",
  //   formData,
  //   {
  //     maxBodyLength: "Infinity",
  //     headers: {
  //       "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
  //       Authorization: `Bearer ${NFT_STORAGE_TOKEN}`,
  //     },
  //   }
  // );
  // return res.data.value.cid;
};

export const pinMultiFilesToNFTStorage = async (files) => {
  const storage = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const cid = await storage.storeDirectory(files);
  return cid;
};

export const pinJsonToNFTStorage = async (jsonObj) => {
  let res = await axios.post(
    "https://api.nft.storage/upload",
    { ...jsonObj },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NFT_STORAGE_TOKEN}`,
      },
    }
  );
  return `https://nftstorage.link/ipfs/${res.data.value.cid}`;
};

export const pinUpdatedJsonDirectoryToNFTStorage = async (
  namelist,
  jsonlist,
  type = UPLOADING_FILE_TYPES.IMAGE
) => {
  let ipfsCid = "";
  try {
    if (jsonlist?.length <= 0) return null;
    let formData = new FormData();
    for (let idx = 0; idx < jsonlist.length; idx++) {
      const blob = new Blob([JSON.stringify(jsonlist[idx])], { type: "application/json" });
      formData.append(
        "file",
        blob,
        `${namelist[idx].name}`
      );
    }

    const metadata = JSON.stringify({
      name: `${type}_${Date.now()}`,
    });
    formData.append("nftStorageMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("nftStorageOptions", options);
    try {
      const res = await axios.post("https://api.nft.storage/upload", formData, {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${NFT_STORAGE_TOKEN}`,
        },
      });
      ipfsCid = res.data.value.cid;
    } catch (error) {
      console.log(error)
      ipfsCid = null;
    }
  } catch (error) {
    console.log(error)
    ipfsCid = null;
  }

  return ipfsCid;
};
