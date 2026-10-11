import { useCallback, useEffect, useState } from "react";
import {getAddresses,createAddress,updateAddress, deleteAddress,setDefaultAddress} from "../../api/addressApi";

const emptyAddress = {
  fullName: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

function getAddressList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.addresses)) return response.addresses;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.addresses)) {
    return response.data.addresses;
  }
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function getAddressId(address) {
  return address.addressId ?? address.id;
}

function AddressManagement() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAddresses();
      setAddresses(getAddressList(response));
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "Unable to load your addresses."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value, }));
  };

  const openAddForm = () => {
    setForm(emptyAddress);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const openEditForm = (address) => {
    setForm({
      fullName: address.fullName ?? "",
      phoneNumber: address.phoneNumber ?? "",
      addressLine1: address.addressLine1 ?? "",
      addressLine2: address.addressLine2 ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      postalCode: address.postalCode ?? "",
      country: address.country ?? "India",
      isDefault: Boolean(address.isDefault),
    });

    setEditingId(getAddressId(address));
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (editingId !== null) {
        await updateAddress(editingId, form);
        setMessage("Address updated successfully.");
      } else {
        await createAddress(form);
        setMessage("Address added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyAddress);

      await loadAddresses();
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "Unable to save this address. Check the required fields."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (address) => {
    const addressId = getAddressId(address);
    if (addressId == null) {
      setError("Could not identify this address.");
      return;
    }
    if (!window.confirm("Delete this address?")) return;

    setBusyId(addressId);
    setError("");
    setMessage("");

    try {
      await deleteAddress(addressId);
      setMessage("Address deleted successfully.");

      if (editingId === addressId) {
        setShowForm(false);
        setEditingId(null);
      }

      await loadAddresses();
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "Unable to delete this address."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleSetDefault = async (address) => {
    const addressId = getAddressId(address);

    if (addressId == null) {
      setError("Could not identify this address.");
      return;
    }

    setBusyId(addressId);
    setError("");
    setMessage("");

    try {
      await setDefaultAddress(addressId);
      await loadAddresses();
      setMessage("Default address updated.");
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "Unable to set the default address."
      );
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <main className="address-page">
        <p>Loading addresses...</p>
      </main>
    );
  }

  return (
    <main className="address-page">
      <header className="address-header">
        <div>
          <h1>My Addresses</h1>
          <p>Manage your delivery addresses.</p>
        </div>
        <button type="button" className="address-primary-button" onClick={openAddForm}>
          + Add Address
        </button>
      </header>
      {error && (<p className="address-error" role="alert"> {error} </p>)}
      {message && (<p className="address-message" role="status"> {message} </p>)}
      {showForm && (
        <section className="address-form-card">
          <h2> {editingId !== null ? "Edit Address" : "Add New Address"} </h2>
          <form onSubmit={handleSubmit}>
            <div className="address-form-grid">
              <label>
                Full Name
                <input name="fullName" value={form.fullName} onChange={handleChange}  autoComplete="name"  required />
              </label>

              <label>
                Phone Number
                <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} autoComplete="tel" required/>
              </label>

              <label className="address-full-width">
                Address Line 1
                <input name="addressLine1" value={form.addressLine1} onChange={handleChange} autoComplete="address-line1" required />
              </label>

              <label className="address-full-width">
                Address Line 2 (optional)
                <input name="addressLine2" value={form.addressLine2}  onChange={handleChange} autoComplete="address-line2"/>
              </label>

              <label>
                City
                <input name="city" value={form.city} onChange={handleChange} autoComplete="address-level2" required/>
              </label>

              <label>
                State
                <input name="state" value={form.state} onChange={handleChange} autoComplete="address-level1"  required/>
              </label>

              <label>
                PIN Code
                <input name="postalCode" value={form.postalCode} onChange={handleChange} autoComplete="postal-code" inputMode="numeric" required/>
              </label>

              <label>
                Country
                <input name="country" value={form.country} onChange={handleChange} autoComplete="country-name" required/>
              </label>
            </div>

            <label className="address-checkbox">
              <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange}/>
              Set as default address
            </label>

            <div className="address-form-actions">
              <button type="submit" className="address-primary-button" disabled={saving}>
                {saving ? "Saving..." : editingId !== null ? "Save Changes": "Save Address"}              </button>

              <button type="button" className="address-secondary-button" disabled={saving} onClick={() => {setShowForm(false); setEditingId(null); setForm(emptyAddress); }}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {addresses.length === 0 ? (
        <section className="address-empty">
          <h2>No saved addresses</h2>
          <p>Add a delivery address to continue with checkout.</p>
        </section>
      ) : (
        <section className="address-list">
          {addresses.map((address) => {
            const addressId = getAddressId(address);
            const isDefault = Boolean(address.isDefault);
            const isBusy = busyId === addressId;

            return (
              <article className="address-card" key={addressId}>
                <div className="address-card-header">
                  <h2>{address.fullName}</h2>
                  {isDefault && (
                    <span className="address-default-badge"> Default </span>
                  )}
                </div>

                <p>{address.phoneNumber}</p>
                <p>{address.addressLine1}</p>

                {address.addressLine2 && (
                  <p>{address.addressLine2}</p>
                )}

                <p>{address.city}, {address.state} - {address.postalCode}</p>
                <p>{address.country}</p>
                <div className="address-card-actions">
                  <button type="button" onClick={() => openEditForm(address)}> Edit </button>
                  <button type="button" className="address-delete-button" disabled={isBusy} onClick={() => handleDelete(address)}>
                    Delete
                  </button>
                  {!isDefault && (
                    <button type="button"  disabled={isBusy} onClick={() => handleSetDefault(address)}>
                      {isBusy ? "Please wait..." : "Set as Default"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default AddressManagement;
