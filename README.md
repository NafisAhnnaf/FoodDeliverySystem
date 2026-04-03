## **Distributed Food Delivery Ecosystem**

 A friend told me React (2024+) and SOAP (The Bronze Age) can be fused together. Turns out that they can actually be friends. This project features a robust (needs work!) JAX-WS Java Backend that utilizes XML-based persistence in an era of MongoDB and PGSQL.

---

## **(Core) Architecture**

The project follows a decoupled client-server architecture:
* **Backend:** Java JAX-WS (SOAP) providing secure, contract-first web services.
* **Persistence:** XML-driven Data Access Layer (no SQL overhead, pure file-based persistence with custom `XmlRepository` logic).
* **Frontend:** React 18 with TypeScript, styled with Tailwind CSS and Framer Motion for a premium, low-latency UX.
* **Communication:** Custom SOAP-to-JSON bridge for seamless frontend-to-backend integration. Check out the `soapClient.ts`. 

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
   cd food-delivery-system
   ```
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the SOAP Service:
   ```bash
   mvn exec:java
   ```
   *The service will be available at `http://localhost:8080/api/`*

### **Frontend Setup**
1. Navigate to the client directory:
   ```bash
   cd food-delivery-ui
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


