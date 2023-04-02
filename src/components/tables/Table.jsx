import { ArrowLongDownIcon } from "@heroicons/react/24/solid";
import React from "react";
import { BsPencilSquare, BsTrash, BsEye } from "react-icons/bs";

const Table = ({ headers, content, onEdit, onDelete, onShow }) => {
  return (
    <table className="whitespace-nowrap w-full">
      <thead className="py-2 px-4 rounded-lg bg-blue-500">
        <tr className="font-bold text-white">
          {headers.map((header, index) => (
            <th
              key={index}
              className="flex gap-1 whitespace-nowrap items-center"
            >
              {header.name}{" "}
              {header.sortable && (
                <span>
                  <ArrowLongDownIcon className="h-3 w-3" />
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.map((item, index) => (
          <tr
            key={index}
            className="flex py-2 text-sm border-b border-gray-200"
          >
            <td>
              {item.image && (
                <img src={item.image} alt={item.name} className="w-20 h-20" />
              )}
              {!item.image && (
                <img
                  src="https://via.placeholder.com/150"
                  alt={item.name}
                  className="w-20 h-20"
                />
              )}
            </td>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>{item.price}</td>
            <td>{item.category}</td>
            <td>{item.status}</td>
            <td>{item.createdAt}</td>
            {headers?.find((item) => item.selector == "actions") && (
              <td className="flex gap-2">
                <button
                  onClick={() => onShow(item.id)}
                  className="flex items-center gap-2 bg-blue-500 p-2 rounded-lg hover:scale-110 transition ease-in-out duration-200"
                >
                  <span>
                    <BsEye className="w-4 h-4 text-white" />
                  </span>
                </button>
                <button
                  onClick={() => onEdit(item.id)}
                  className="flex items-center gap-2 bg-green-500 p-2 rounded-lg hover:scale-110 transition ease-in-out duration-200"
                >
                  <span>
                    <BsPencilSquare className="w-4 h-4 text-white" />
                  </span>
                </button>

                <button
                  onClick={() => onDelete(item.id)}
                  className="flex items-center gap-2 bg-red-500 p-2 rounded-lg hover:scale-110 transition ease-in-out duration-200"
                >
                  <span>
                    <BsTrash className="w-4 h-4 text-white" />
                  </span>
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
