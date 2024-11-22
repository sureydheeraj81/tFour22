import React, { useState } from 'react';
import { getAllReject } from "../../services/Apis"
import { Link } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import * as XLSX from 'xlsx';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';



const RejectedUserList = () => {
  const [inputs, setInputs] = useState('');
  const [count, setCount] = useState(10);

  const fetchApplications = async () => {
    try {
      const response = await getAllReject()
      return response.data.RejectedData
    } catch (error) {
      toast.error('Error fetching data:', error);
      return []
    }
  };

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["pendingUsers"],
    queryFn: fetchApplications,
    onSuccess: () => {
      toast.success('Data loaded successfully!');
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
    },
  });

  const filteredUsers = Array.isArray(data)
    ? data
      .filter(user =>
        [user.name, user.email, user.application_no, user.username, user.mobile_no, user.region]
          .some(field => field?.toLowerCase().includes(inputs.toLowerCase()))
      )
      .slice(0, count)
    : [];
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'RejectedUsers.xlsx');
  };




  const handleChange = (e) => {
    setCount(parseInt(e.target.value, 10));
  };
  return (

    <Sidebar>
      <div className="clear">
        <div className="section_heading">
          <h2 className="title_heading">CORS Registration List</h2>
        </div>
        <div className="mb-4" onClick={exportToExcel} disabled={data.length === 0}>Export to Excel</div>
        <div>
          <div className="box_header">
            <div style={{ padding: "5px 0px" }}>
              <i className="fa-regular fa-rectangle-list mx-3"></i>&nbsp;  Total Rejected Users: <b>{data.length}</b>
            </div>
          </div>
          <div>
            <div className="box_body">
              <form
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <label className="col-md-10">Records per page:</label>
                  <div className="col-md-8">
                    <select
                      className="form-select"
                      value={count}
                      onChange={handleChange}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>

                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <input
                    type="text"
                    value={inputs}
                    onChange={e => setInputs(e.target.value)}

                    placeholder="Search here ..."
                    style={{ borderRight: "none", padding: "0px 10px", outline: "none" }}
                  />
                  <button style={{ borderLeft: "none", }}><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>
              </form>
              <table className=" table table-bordered data_table">

                <thead className="table-primary">
                  <tr>
                    <th>SNo</th>
                    <th>Application No</th>
                    <th>Reg. Date/Time</th>
                    <th className="desc">User Information</th>
                    <th>Account Status</th>
                    <th>Update By</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((app, index) => (
                      <tr key={app.application_no}>
                        <td>{index + 1}</td>
                        <td>{app.application_no}</td>
                        <td>{app.date_created}</td>
                        <td className="desc">
                          <div>
                            <strong>Name:</strong> {app.name} <br />
                            <strong>Email:</strong> {app.email} <br />
                            <strong>Phone:</strong> {app.mobile_no} <br />
                            <strong>User Type:</strong> {app.usertype} <br />
                            <strong>Organization:</strong> {app.emptype} <br />
                            <strong>Region:</strong> {app.region} <br />
                          </div>
                        </td>
                        <td><div>{app.is_rejected}</div><div>{app.rejected_reason}</div></td>
                        <td>{app.updatedBy}</td>
                        <td>
                          <button className="btn btn-warning">
                            <Link to={`/admin/approved/${app.sno}`} className="text-decoration-none text-dark">
                              <i className="fa-solid fa-pen-to-square"></i>

                            </Link>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="d-md-flex d-sm-block justify-content-between mt-2">

            </div>
          </div>
        </div>
      </div>
    </Sidebar>


  );
};

export default RejectedUserList;







