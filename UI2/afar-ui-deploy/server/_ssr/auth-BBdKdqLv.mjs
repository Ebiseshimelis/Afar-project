import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { d as logout, f as me, u as login } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BBdKdqLv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(null);
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const refresh = (0, import_react.useCallback)(async () => {
		try {
			setUser(await me());
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const signIn = (0, import_react.useCallback)(async (email, password, loginType) => {
		const u = await login(email, password, loginType);
		setUser(u);
		return u;
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		await logout();
		setUser(null);
	}, []);
	const value = (0, import_react.useMemo)(() => {
		const isSuperAdmin = user?.role === "super_admin";
		const can = (permission) => {
			if (!user || !user.is_active) return false;
			if (isSuperAdmin || user.permissions.includes("*")) return true;
			return user.permissions.includes(permission);
		};
		return {
			user,
			loading,
			isAuthenticated: !!user && user.is_active,
			isSuperAdmin,
			can,
			canAny: (perms) => perms.some(can),
			signIn,
			signOut,
			refresh
		};
	}, [
		user,
		loading,
		signIn,
		signOut,
		refresh
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
	return ctx;
}
//#endregion
export { useAuth as n, AuthProvider as t };
