import { ArrowLongDownIcon } from "@heroicons/react/24/solid";
import React from "react";
import { BsPencilSquare, BsTrash, BsEye } from "react-icons/bs";

const Table = ({ headers, content, onEdit, onDelete, onShow }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {header.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.map((item, i) => (
            <tr
              key={i}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {headers.map((header, index) => {
                return header.selector === "image" ? (
                  <td key={index} scope="row" className="px-6 py-4">
                    <img
                      src={item[header.selector]}
                      alt={"article_image"}
                      className="w-20 h-20 min-w-[75px] min-h-[75px] object-cover rounded-lg"
                    />
                  </td>
                ) : header.selector === "name" ? (
                  <td
                    key={index}
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item[header.selector]}
                  </td>
                ) : header.selector === "price" ? (
                  <td key={index} className="px-6 py-4">
                    price
                    {item[header.selector]}
                  </td>
                ) : header.selector === "actions" ? (
                  <td key={index} className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onShow(item.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-white hover:bg-blue-500 p-2 rounded-lg hover:scale-110 transition ease-in-out duration-200"
                      >
                        <span>
                          <BsEye className="w-4 h-4" />
                        </span>
                      </button>
                      <button
                        onClick={() => onEdit(item.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-white hover:bg-green-500 p-2 rounded-lg hover:scale-110 transition ease-in-out duration-200"
                      >
                        <span>
                          <BsPencilSquare className="w-4 h-4" />
                        </span>
                      </button>

                      <button
                        onClick={() => onDelete(item.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-white hover:bg-red-500 p-2 rounded-lg hover:scale-110 transition ease-in-out duration-200"
                      >
                        <span>
                          <BsTrash className="w-4 h-4 " />
                        </span>
                      </button>
                    </div>
                  </td>
                ) : (
                  <td key={index} className="px-6 py-4">
                    {item[header.selector]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
