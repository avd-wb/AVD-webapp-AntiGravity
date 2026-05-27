import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  setDoc, 
  addDoc 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if provided in config
export const db = firebaseConfig.firestoreDatabaseId 
  ? initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId)
  : initializeFirestore(app, {});

export const auth = getAuth(app);

// ==============================================================
// FIRESTORE CLIENT DATA WRAPPERS
// ==============================================================

export interface Employee {
  hrms_id: string;
  full_name: string;
  current_designation: string;
  current_district: string;
  dob: string;
  doj: string;
  doc: string;
  gender: string;
  caste: string;
  mobile: string;
  email: string;
  wbvc_no: string;
}

export interface Order {
  id: string;
  title: string;
  order_no: string;
  memo_no: string;
  order_date: string;
  order_type: string;
  mimeType: string;
  full_path: string;
  viewUrl: string;
}

export interface OrderLink {
  matched_hrms_id: string;
  full_name: string;
  officer_name_raw: string;
  order_id: string;
  order_no: string;
  order_date: string;
  order_type: string;
  designation: string;
  place: string;
  district: string;
  from_place: string;
  to_place: string;
  remarks: string;
  drive_link: string;
}

/**
 * Fetch an officer's profile by HRMS ID.
 */
export async function getEmployeeProfile(hrmsId: string): Promise<Employee | null> {
  try {
    const docRef = doc(db, "employees", hrmsId.trim());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Employee;
    }
  } catch (err) {
    console.error("Firestore getEmployeeProfile error:", err);
  }
  return null;
}

/**
 * Fetch all orders containing the employee's name in their mentioned_employees array.
 */
export async function getPersonalOrders(hrmsId: string): Promise<OrderLink[]> {
  try {
    const linksRef = collection(db, "employee_order_links");
    const q = query(
      linksRef,
      where("matched_hrms_id", "==", hrmsId.trim())
    );
    const querySnapshot = await getDocs(q);
    const links: OrderLink[] = [];
    querySnapshot.forEach((doc) => {
      links.push(doc.data() as OrderLink);
    });
    return links.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
  } catch (err) {
    console.error("Firestore getPersonalOrders error:", err);
  }
  return [];
}

/**
 * Query general orders repository with filters.
 */
export async function getRepositoryOrders(filters: { search?: string; type?: string; sortBy?: string } = {}): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    let q = query(ordersRef, orderBy("order_date", "desc"));
    
    if (filters.type && filters.type !== "ALL") {
      q = query(ordersRef, where("order_type", "==", filters.type));
    }
    
    const querySnapshot = await getDocs(q);
    let orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    // Sort logic
    if (filters.sortBy === "date-asc") {
      orders.sort((a, b) => new Date(a.order_date).getTime() - new Date(b.order_date).getTime());
    } else {
      orders.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
    }
    
    // Client-side text search
    if (filters.search) {
      const term = filters.search.toLowerCase();
      orders = orders.filter(o => 
        o.title.toLowerCase().includes(term) ||
        (o.order_no && o.order_no.toLowerCase().includes(term)) ||
        (o.memo_no && o.memo_no.toLowerCase().includes(term)) ||
        (o.full_path && o.full_path.toLowerCase().includes(term))
      );
    }
    
    return orders;
  } catch (err) {
    console.error("Firestore getRepositoryOrders error:", err);
  }
  return [];
}

/**
 * Request permission for browser push notifications.
 */
export async function requestNotificationPermission() {
  try {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Push notification permission granted.");
      }
    }
  } catch (err) {
    console.error("Error requesting notification permission:", err);
  }
}

