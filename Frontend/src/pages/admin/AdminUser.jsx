import { useCallback, useEffect, useMemo, useState } from "react";
import {getAdminUsers, activateUser, deactivateUser,changeUserRole,} from "../../api/adminUserApi";

const AVAILABLE_ROLES = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Seller" },
  { id: 3, name: "Customer" }
];

function unwrapResponse(response) {
  return response?.data ?? response;
}

function getUserList(response) {
  const data = unwrapResponse(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;

  return [];
}

function getUserId(user) {
  return user?.id ?? user?.userId ?? user?.userID ?? null;
}

function getUserName(user) {
  return (user?.userName ?? "Unnamed user");
}

function getUserRole(user) {
  const role = user?.role ?? null;
  return role || "Unknown";
}

function getActiveStatus(user) {
  return user?.isActive ?? user?.active ?? user?.isActivated ?? null;
}

function getErrorMessage(error) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;

  return (data?.message ?? data?.title ?? error?.message ?? "The operation failed.");
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");
  const [busyUserId, setBusyUserId] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getAdminUsers({
        PageNumber: 1,
        PageSize: 100,
      });

      setUsers(getUserList(response));
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return users.filter((user) => {
      const name = getUserName(user).toLowerCase();
      const email = String(user?.email ?? "").toLowerCase();
      const role = getUserRole(user);
      const active = getActiveStatus(user);

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        email.includes(searchText) ||
        String(getUserId(user) ?? "").includes(searchText);

      const matchesRole =
        roleFilter === "All" ||
        role
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .includes(roleFilter.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && active === true) ||
        (statusFilter === "Inactive" && active === false);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleStatusChange = async (user) => {
    const userId = getUserId(user);
    const active = getActiveStatus(user);

    if (userId == null || typeof active !== "boolean") {
      setActionError(
        "The user ID or account status is missing from the API response."
      );
      return;
    }

    const action = active ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${getUserName(user)}'s account?`
    );

    if (!confirmed) return;

    try {
      setBusyUserId(userId);
      setActionError("");
      setMessage("");

      if (active) {
        await deactivateUser(userId);
      } else {
        await activateUser(userId);
      }

      setMessage(`User account ${action}d successfully.`);
      await loadUsers();
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setBusyUserId(null);
    }
  };

  const handleRoleChange = async (user, nextRole) => {
    const userId = getUserId(user);  

    if (userId == null || !nextRole) {
      setActionError("A valid user ID and role are required.");
      return;
    }
    const currentRole = getUserRole(user);

    // if (currentRole.toLowerCase() === nextRole.toLowerCase()) {
    //   return;
    // }

    const confirmed = window.confirm(`Change ${getUserName(user)}'s role from ${currentRole} to ${nextRole}?`);

    if (!confirmed) {
      await loadUsers();
      return;
    }

    try {
      setBusyUserId(userId);
      setActionError("");
      setMessage("");
      console.log(userId,nextRole)
      await changeUserRole(userId, nextRole);
      setMessage("User role updated successfully.");
      await loadUsers();
    } catch (error) {
      setActionError(getErrorMessage(error));
      await loadUsers();
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <main className="admin-users-page">
      <header className="admin-users-header">
        <div>
          <p className="admin-users-eyebrow">ADMINISTRATION</p>
          <h1>User Management</h1>
          <p>Manage accounts, roles, and account status.</p>
        </div>

        <button className="admin-users-refresh" onClick={loadUsers} disabled={loading}>
          {loading ? "Loading..." : "Refresh Users"}
        </button>
      </header>

      {pageError && (
        <div className="admin-users-alert error">
          {pageError}
        </div>
      )}

      {actionError && (
        <div className="admin-users-alert error">
          {actionError}
        </div>
      )}

      {message && (
        <div className="admin-users-alert success">
          {message}
        </div>
      )}

      <section className="admin-users-filters">
        <input type="search" placeholder="Search by name, email or user ID..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search users" />
        <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="Filter by role">
          <option value="All">All roles</option>
          {AVAILABLE_ROLES.map((role) => (
            <option key={role.id} value={role}> {role.name} </option>
          ))}
        </select>

        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by account status">
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </section>

      <div className="admin-users-summary">
        Showing <strong>{filteredUsers.length}</strong> of{" "}
        <strong>{users.length}</strong> loaded users
      </div>

      {loading ? (
        <p className="admin-users-empty">Loading users...</p>
      ) : pageError ? (
        <p className="admin-users-empty">
          Unable to display users. Check the API response and try again.
        </p>
      ) : filteredUsers.length === 0 ? (
        <p className="admin-users-empty">No matching users found.</p>
      ) : (
        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Status</th>
                <th>Change Role</th>
                <th>Account Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => {
                const userId = getUserId(user);
                const role = getUserRole(user);
                const active = getActiveStatus(user);
                const busy = busyUserId === userId;

                return (
                  <tr key={userId ?? index}>
                    <td>
                      <strong>{getUserName(user)}</strong>
                      <span className="admin-users-email"> {user?.email ?? "No email"} </span>
                    </td>

                    <td>{userId ?? "—"}</td>

                    <td>{role}</td>

                    <td>
                      {typeof active === "boolean" ? (
                        <span className={`admin-user-status ${active ? "active" : "inactive"}`}> {active ? "Active" : "Inactive"} </span>
                      ) : (
                        <span className="admin-user-status unknown"> Unknown </span>
                      )}
                    </td>

                    <td>
                      <select value={ AVAILABLE_ROLES.find((item) => item.name.toLowerCase() === role.toLowerCase())?.id ?? ""}
                        onChange={(event) => handleRoleChange(user, Number(event.target.value))} disabled={busy}  aria-label={`Change role for ${getUserName(user)}`}>
                        <option value="" disabled>
                          Select role
                        </option>
                        {AVAILABLE_ROLES.map((availableRole) => (
                          <option key={availableRole.id} value={availableRole.id}> {availableRole.name} </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button className={active ? "admin-user-action deactivate" : "admin-user-action activate"}
                        disabled={busy || typeof active !== "boolean"}
                        onClick={() => handleStatusChange(user)}
                      >
                        {busy ? "Saving..." : active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
