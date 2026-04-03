## **Distributed Food Delivery Ecosystem**

A full-stack ecosystem that proves React (2024+) and SOAP (The Bronze Age) can actually be friends. This project features a robust JAX-WS Java Backend that stubbornly refuses to use JSON, opting instead for the "vintage elegance" of XML-based persistence in an era of NoSQL dominance.

### The Highlights:

- Frontend-to-Legacy Bridge: A modern TypeScript interface that talks to the server by manually crafting SOAP Envelopes using the native fetch API—because who needs REST when you have raw XML strings?

- The "Database" (sort of): A custom-built XmlRepository layer that treats .xml files like high-performance data clusters (and definitely doesn't cause a merge conflict nightmare).

- Business Logic: Handles the full lifecycle of a delivery—from the Kitchen Monitor grid (very modern) to Rider Fleet Management (very automated), all synchronized via the "ancient scrolls" of JAX-WS.

- Fun Fact: No Axios, no Apollo, no Redux. Just pure, unadulterated fetch() calls delivering heavy-duty SOAP payloads, proving that if you try hard enough, you really can put a Tesla engine inside a 1990 Volvo.
---

## **(Core) Architecture**

The project follows a decoupled client-server architecture:
* **Backend:** Java JAX-WS (SOAP) providing secure, contract-first web services.
* **Persistence:** XML-driven Data Access Layer (no SQL overhead, pure file-based persistence with custom `XmlRepository` logic).
* **Frontend:** React 18 with TypeScript, styled with Tailwind CSS and Framer Motion for a premium, low-latency UX.
* **Communication:** Custom SOAP-to-JSON bridge for seamless frontend-to-backend integration.

---

## **Key Features**

### **1. Customer Experience**
* **Dynamic Storefront:** Browse restaurants with real-time "Open/Closed" status based on operating schedules.
* **Parallel Menu Layout:** 70/30 split view showing categorized menus alongside weekly operating hours.
* **Persistent Cart Engine:** LocalStorage-backed cart that prevents cross-restaurant ordering conflicts.

### **2. Admin & Fleet Management**
* **Fleet Command:** Full CRUD for Rider management, including "Appoint Rider" logic and license verification.
* **Real-time Tracking:** Monitor order transitions from `PENDING` to `DELIVERED`.
* **Automated Logistics:** The system automatically handles rider availability (busy/available) upon order assignment and completion.

### **3. Kitchen Monitor**
* **Grid-Based Dashboard:** A high-density "Kitchen View" for restaurant owners to track active orders.
* **Status Lifecycle:** Professional workflow management: `PENDING` → `PREPARING` → `OUT_FOR_DELIVERY` → `DELIVERED`.

---

## **Tech Stack**

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind CSS, Lucide React, React Hot Toast |
| **Backend** | Java, JAX-WS (SOAP), Maven |
| **Data** | XML Persistence (JAXB / Custom Repository) |
| **API** | SOAP (Simple Object Access Protocol) |

---

## **Getting Started**

### **Prerequisites**
* **JDK 11** or higher
* **Maven 3.8+**
* **Node.js 18+** & **npm**

### **Backend Setup**
1. Navigate to the server directory:
   ```bash
   cd delivery-backend
   ```
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the SOAP Service:
   ```bash
   mvn glassfish:run  # or your specific server command
   ```
   *The service will be available at `http://localhost:8080/api/`*

### **Frontend Setup**
1. Navigate to the client directory:
   ```bash
   cd delivery-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## **Project Structure**

```text
├── delivery-backend
│   ├── src/main/java/com/swe4302
│   │   ├── controllers/   # SOAP Service Implementation
│   │   ├── models/        # POJOs (Order, User, Rider, Delivery)
│   │   ├── repositories/  # XML-based Persistence Logic
│   │   └── services/      # Business Logic (Order/Delivery Service)
│   ├── pom.xml            # Maven Configuration
│   └── data/              # XML Database Files (.xml)
│
├── delivery-frontend
│   ├── src
│   │   ├── components/    # Reusable UI Components
│   │   ├── pages/         # RestaurantDetails, Dashboard, Cart
│   │   ├── utils/         # SOAP Client & Cart Engine
│   │   └── App.tsx        # Routing Logic
```

---

## **System Design Note: XML Persistence**
Unlike standard SQL databases, this system uses an **Atomic XML Update** strategy. Every transaction (like updating an order status) involves:
1.  Loading the master XML list into memory.
2.  Filtering and updating the specific object reference.
3.  Synchronizing dependent objects (e.g., updating a Rider's status when an Order is delivered).
4.  Persisting the entire collection back to the XML file to ensure data integrity.

---

## **Git Guidelines**
* **Ignore Local Data:** Ensure `*.xml` files are in your `.gitignore` to avoid overwriting the "database" during merges.
* **Maven:** Standard Maven `target/` folders are excluded to keep the repo clean.