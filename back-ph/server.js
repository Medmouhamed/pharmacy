/*
!!! PLEASE READ API_DESCRIPTION FOLDER TO UNDERSTAND AND ORGANIZE THE PARTS OF EACH ENDPOINT *YAHYA MEKSEN*!!!
*/

/*=================== NEEDS ===============*/
const dotenv = require('dotenv').config(); //من اجل الاتصال بقاعدة البيانات من اجهزة مختلفة بشرط ان يكونو في نفس الشبكة

const cors = require('cors'); //من اجل جعل ملفات محلية بامكانها الاتصال بالمنفذ بدون الحاجة الى ربطها بقاعدة البيانات و backend
const oracledb = require('oracledb');
const express = require('express');
const { outFormat } = require('oracledb');
const app = express();
const port = 3000;

/*=================== MIDDLEWARES ===========*/
app.use(express.json());
app.use(cors());

/*===================== AUTH CONFIG FOR ORACLE ===========*/
const oracledbConfig = {
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
  connectString: `${process.env.DB_HOST}:1521/XEPDB1`
}

/*=============== SETUP AND CONFIRM THE CONNECTION =======================*/
async function startApp() {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    console.log("Successfull 🟢");

    const result = await conn.execute(`SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD') FROM DUAL`);
    console.log(`The Result :${result.rows[0]}`);

    const userResult = await conn.execute(`SELECT USER FROM DUAL`);
    console.log(`Current User: ${userResult.rows[0]}`);

    app.listen(port, () => {
      console.log(`Server is running at: http://localhost:${port}`);
    })

  } catch (err) {
    console.error("🔴 Failed to connect to DB. Server not started.");
    console.error("Error: " + err.message);
    process.exit(1);

  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
}
startApp();


/*======================== END POINTS =================*/

//****************** MEDICINE*****************//
app.get('/medicines', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);

    const sql = 'SELECT * FROM MEDICINE';

    let result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json(result.rows);
    result.rows.forEach(row => {
      console.log(row);
    });

  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);
    
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.get('/medicines/:categoryId', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    const categoryId = req.params.categoryId;

    let min_range = categoryId * 100 + 1;
    let max_range = min_range + 9;

    const sql = `SELECT M.* FROM MEDICINE M JOIN SHELF S ON M.IDS = S.IDS WHERE S.IDC = :category_id`;

    let result = await conn.execute(sql, [categoryId], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json(result.rows);
    result.rows.forEach(row => {
      console.log(row);
    });

  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);
    
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.get('/medicines/detials/:name', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    let medicine_name = req.params.name;

    const sql = `SELECT * FROM MEDICINE WHERE NAME = :name`

    let result = await conn.execute(sql, [medicine_name], { outFormat: oracledb.OUT_FORMAT_OBJECT })

    if (result.rows.length == 0) {
      console.log('MEDICINE NOT FOUND 🔴')
      return res.status(404).json({
        message: "MEDICINE NOT FOUND 🔴",
      })
    }

    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.post('/medicines/add', async (req, res) => {
  let conn;

  try {
    conn = await oracledb.getConnection(oracledbConfig);
    let { IDC, IDS, NAME, MANUFACTURE, QUANTITY, EXPIRYDATE, PRICE } = req.body;

    const sql = "INSERT INTO MEDICINE(NAME,MANUFACTURE,QUANTITY,EXPIRYDATE,IDS,PRICE) VALUES (:NAME,:MANUFACTURE,:QUANTITY,TO_DATE(:EXPIRYDATE, 'YYYY-MM-DD'),:IDS,:PRICE)"

    let result = await conn.execute(sql, {
      NAME: NAME,
      MANUFACTURE: MANUFACTURE,
      QUANTITY: QUANTITY,
      EXPIRYDATE: EXPIRYDATE,
      IDS: IDS,
      PRICE: PRICE
    },
      {
        autoCommit: true
      }
    );

    console.log(`MEDICINE ADD SUCCESSFULLY 🟢 --->:${result.rowsAffected}`);
    console.log(`Name: ${NAME} AND IDS: ${IDS}`);

    res.status(201).json({
      message: "MEDICINE ADD SUCCESSFULLY 🟢",
      rowsAffected: result.rowsAffected
    });



  } catch (err) {
    console.error("🔴 Error Adding Medicine:" + err);
    res.status(500).send(err.message)


  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.put('/medicines/update/:name', async (req, res) => {
  let conn;
  let { MANUFACTURE, QUANTITY, EXPIRYDATE, PRICE } = req.body;
  try {
    conn = await oracledb.getConnection(oracledbConfig);

    const medicin_name = req.params.name;

    const sql = `UPDATE MEDICINE SET 
    MANUFACTURE = :manufacture,
    QUANTITY = :quantity, 
    EXPIRYDATE = TO_DATE(:expirydate, 'YYYY-MM-DD'), 
    PRICE = :price
    WHERE NAME = :name`

    let result = await conn.execute(sql, {
      manufacture: MANUFACTURE,
      quantity: QUANTITY,
      expirydate: EXPIRYDATE,
      price: PRICE,
      name: medicin_name
    },
      {
        autoCommit: true
      });

    if (result.rowsAffected == 0) {
      console.log('MEDICINE NOT FOUND 🔴')
      return res.status(404).json({
        message: "MEDICINE NOT FOUND 🔴",
        rowsAffected: result.rowsAffected
      })
    }

    res.status(200).json({
      message: "MEDICINE UPDATE SUCCESSFULLY 🟢",
      rowsAffected: result.rowsAffected
    });
    console.log("MEDICINE UPDATE SUCCESSFULLY 🟢")

  } catch (err) {
    console.error("🔴 Error Updating Medicine:" + err);
    res.status(500).send(err.message)
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }

})
app.delete('/medicine/delete/:name', async (req, res) => {
  let conn;
  try {

    conn = await oracledb.getConnection(oracledbConfig);

    const medicine_name = req.params.name;

    const sql = `DELETE FROM MEDICINE WHERE NAME = :name`;

    let result = await conn.execute(sql, [medicine_name], { autoCommit: true });

    if (result.rowsAffected === 0) {
      console.log('MEDICINE NOT FOUND 🔴')
      return res.status(404).json({
        message: "MEDICINE NOT FOUND 🔴",
        rowsAffected: result.rowsAffected
      })
    }

    res.status(200).json({
      message: "MEDICINE DELETING SUCCESSFULLY 🟢",
      rowsAffected: result.rowsAffected
    })


  } catch (err) {
    console.error("🔴 Error Deleting Medicine:" + err);
    res.status(500).send(err.message)

  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})

//****************** SHELFS *****************//
app.get('/shelfs', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);

    const sql = 'SELECT * FROM SHELF'

    let result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json(result.rows);
    result.rows.forEach(row => {
      console.log(row);
    });

  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);
   
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.get('/shelfs/:categoryId', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    const category_id = req.params.categoryId;
    const sql = 'SELECT IDS FROM SHELF WHERE IDC = :idc';

    const result = await conn.execute(sql, [category_id], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json(result.rows);
    result.rows.forEach(row => {
      console.log(row);
    });

  } catch (err) {
    console.error("Error:" + err);
    res.status(500).send(err.message);


  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }

});

//****************** CATEGORIES *****************//
app.get('/categories', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);

    let sql = 'SELECT * FROM  CATEGORY';
    let result = await conn.execute(sql, [], {
      oracledb: oracledb.OUT_FORMAT_OBJECT
    });
    res.json(result.rows);
    result.rows.forEach(row => {
      console.log(row);
    });



  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);

  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
});

//****************** DOCTORS *****************//
app.get('/doctors', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    const sql = `SELECT * FROM DOCTOR`;
    let result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json(result.rows);

    result.rows.forEach(row => {
      console.log(row);
    });

  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);

  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.get('/doctors/:id_doctor', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);

    let id_doctor = req.params.id_doctor;

    const sql = `SELECT * FROM DOCTOR WHERE ID_D= :id_doctor`;

    let result = await conn.execute(sql, [id_doctor], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "DOCTORS NOT FOUND 🔴"
      })
    }
    res.status(200).json(result.rows);


  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);

  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.post('/doctors/add', async (req, res) => {
  let conn;
  let { NAME_D, SPECIALITY, ADDRESS } = req.body
  try {
    conn = await oracledb.getConnection(oracledbConfig);

    const sql = `INSERT INTO DOCTOR ( NAME_D, SPECIALITY, ADDRESS) VALUES (:name_d, :speciality, :address)`

    let result = await conn.execute(sql, {
      name_d: NAME_D,
      speciality: SPECIALITY,
      address: ADDRESS
    }, {
      autoCommit: true
    })
    res.status(200).json({
      message: "ADDING DOCTOR SUCESSFULLY 🟢"
    })



  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);

  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.delete('/doctors/delete/:id_doctor', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    let id_doctor = req.params.id_doctor
    const sql = `DELETE FROM DOCTOR WHERE ID_D = :id_doctor`;
    let result = await conn.execute(sql, [id_doctor], { autoCommit: true })

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        message: "DOCTOR NOT FOUND 🔴"
      })
    }
    res.status(200).json({
      message: "DELETING SUCCESSFULLY 🟢",
      rowsAffected: result.rowsAffected
    })
  } catch (err) {
    if (err.errorNum === 2292) {
      return res.status(409).json({
        message: "CAN'T DELETE BECAUSE DOCTOR HAS RECORDS"
      })
    }
    res.status(500).send("🔴 Server Error: " + err.message);
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.put('/doctors/update/:id_doctor', async (req, res) => {
  let conn;
  let { NAME_D, SPECIALITY, ADDRESS } = req.body;
  try {
    conn = await oracledb.getConnection(oracledbConfig);

    const id_doctor = req.params.id_doctor;

    const sql = `UPDATE DOCTOR SET 
    NAME_D = :name_doctor,
    SPECIALITY = :spe, 
    ADDRESS = :address
    WHERE ID_D = :id`

    let result = await conn.execute(sql, {
      name_doctor: NAME_D,
      spe: SPECIALITY,
      address: ADDRESS,
      id: id_doctor
    },
      {
        autoCommit: true
      });

    if (result.rowsAffected == 0) {
      return res.status(404).json({
        message: "DOCTOR NOT FOUND 🔴",
        rowsAffected: result.rowsAffected
      })
    }

    res.status(200).json({
      message: "DOCTOR UPDATE SUCCESSFULLY 🟢",
      rowsAffected: result.rowsAffected
    });
    console.log("DOCTOR UPDATE SUCCESSFULLY 🟢")

  } catch (err) {
    console.error("🔴 Error Updating Doctors:" + err);
    res.status(500).send(err.message)
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})

//****************** PATIENTES *****************//
app.get('/patientes', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    const sql = `SELECT * FROM PATIENT`;
    let result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json(result.rows);

    result.rows.forEach(row => {
      console.log(row);
    });

  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);

  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.get('/patientes/:id_patient', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);

    let id_patient = req.params.id_patient;

    const sql = `SELECT * FROM PATIENT WHERE ID_P= :patient`;

    let result = await conn.execute(sql, [id_patient], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "PATEINTS NOT FOUND 🔴"
      })
    }

    res.status(200).json(result.rows);


  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);

  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.post('/patientes/add', async (req, res) => {
  let conn;
  let { FANAME, LNAME, AGE } = req.body
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    const sql = `INSERT INTO PATIENT ( FANAME , LNAME , AGE) VALUES (:faname ,: lname ,: age)`

    let result = await conn.execute(sql, {
      faname: FANAME,
      lname: LNAME,
      age: AGE
    },
      {
        autoCommit: true
      })

    res.status(200).json({
      message: "ADDING PATIENT SUCCESSFULLY 🟢"
    })


  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.delete('/patientes/delete/:id_patient', async (req, res) => {
  let conn;
  let id_patient = req.params.id_patient
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    const sql = `DELETE FROM PATIENT WHERE ID_P = :id_patient`

    let result = await conn.execute(sql, [id_patient], { autoCommit: true })

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        message: "PATIENT NOT FOUND 🔴"
      });
    }


    res.status(200).json({
      message: "DELETING PATIENT SUCCESSFULLY 🟢"
    })


  } catch (err) {
    if (err.errorNum === 2292) {
      return res.status(409).json({
        message: "CAN'T DELETE BECAUSE PATIENT HAS RECORDS"
      })
    }
    res.status(500).send("🔴Server Error: " + err.message);
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.get('/doctor/patient-history/:id_patient', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    let id_patient = req.params.id_patient;

    const sql = `SELECT 
    P.ID AS PRESCRIPTION_ID,
    P.DATE_P,
    P.STATUS,
    PA.FANAME || ' ' || PA.LNAME AS PATIENT_NAME,
    PA.AGE,
    D.NAME_D AS DOCTOR_NAME,
    D.SPECIALITY,
    S.NAME || ' ' || S.LANAME AS DELIVERED_NAME,
    PH.NAME AS PHARMACY_NAME,
    M.NAME AS MEDICINE_NAME,
    I.FREQ AS FREQUENCY,
    I.DOSAGE

    FROM PRESCRIPTION P 
    JOIN DOCTOR D ON P.ID_DOCTOR = D.ID_D 
    JOIN PATIENT PA ON P.ID_PATIENT = PA.ID_P
    JOIN INCLUDE I ON I.ID_P_R = P.ID
    JOIN MEDICINE M ON I.ID_MED = M.NAME
    LEFT JOIN SALESPERSON S ON S.ID_SP = P.ID_SP
    LEFT JOIN PHARMACY PH ON PH.ID_P = S.ID_P
    WHERE PA.ID_P = :id_pat
    ORDER BY P.DATE_P DESC
    `

    let result = await conn.execute(sql, [id_patient], { outFormat: oracledb.OUT_FORMAT_OBJECT })

    let organize_result = result.rows.reduce((acc, row) => {

      let id = row.PRESCRIPTION_ID
      if (!acc[id]) {
        acc[id] = {
          PRESCRIPTION_ID: id,
          DATE_P: row.DATE_P,
          STATUS: row.STATUS,
          PATIENT_NAME: row.PATIENT_NAME,
          AGE: row.AGE,
          DOCTOR_NAME: row.DOCTOR_NAME,
          SPECIALITY: row.SPECIALITY,
          SALES_PERSON_NAME: row.DELIVERED_NAME || 'no delivreed yet',
          PHARMACY_NAME: row.PHARMACY_NAME || 'N/A',
          MEDICINES: []
        }
      }

      acc[id].MEDICINES.push({
        MEDICINE_NAME: row.MEDICINE_NAME,
        FREQUENCY: row.FREQUENCY,
        DOSAGE: row.DOSAGE
      })



      return acc;
    }, {})

    res.status(200).json(Object.values(organize_result));


  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }

  }
})
app.get('/patientes/search/:id_prescription', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    let id_prescription = req.params.id_prescription

    const check_medicine_sql = `SELECT M.NAME , M.QUANTITY FROM MEDICINE M 
          WHERE M.NAME IN (SELECT I.ID_MED FROM INCLUDE I WHERE ID_P_R = :id_pres)`

    let result = await conn.execute(check_medicine_sql, [id_prescription], { outFormat: oracledb.OUT_FORMAT_OBJECT })

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: 'Prescripton Not Found .Error 404'
      })
    }
    let empty_medicines = result.rows.find(row => row.QUANTITY === 0)


    if (empty_medicines) {
      return res.status(400).json({
        status: 'UNAVAILABLE',
        message: `Sorry ${empty_medicines.NAME} Medicine Not Available For Now`
      })
    }


    const sql = `SELECT NAME , ADDRESS FROM PHARMACY`

    result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.status(200).json({
      status: 'AVAILABLE',
      message: 'Your Prescription is availavle, go to any of those pharmacies',
      parmacies: result.rows
    })
  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})

//****************** PRSCRIPTION *****************//
app.get('/prscription/details', async (req, res) => {
  let conn;

  try {
    conn = await oracledb.getConnection(oracledbConfig);
    const sql = `SELECT 
    P.ID AS PRESCRIPTION_ID,
    P.DATE_P,
    P.STATUS,
    D.NAME_D AS DOCTOR_NAME,
    D.ID_D,
    D.SPECIALITY,
    PA.FANAME || ' ' || PA.LNAME AS PATIENT_NAME,
    PA.ID_P,
    PA.AGE,
    I.ID_MED AS MEDICINE,
    I.FREQ AS FREQUENCY,
    I.DOSAGE
    FROM PRESCRIPTION P 
    JOIN DOCTOR D ON P.ID_DOCTOR = D.ID_D
    JOIN PATIENT PA ON P.ID_PATIENT = PA.ID_P
    JOIN INCLUDE I ON P.ID = I.ID_P_R
    ORDER BY P.ID DESC`

    let result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT })

    let organize_result = result.rows.reduce((acc, row) => {
      let id = row.PRESCRIPTION_ID
      if (!acc[id]) {
        acc[id] = {
          PRESCRIPTION_ID: id,
          DATE_P: row.DATE_P,
          STATUS: row.STATUS,
          DOCTOR_NAME: row.DOCTOR_NAME,
          SPECIALITY: row.SPECIALITY,
          PATIENT_NAME: row.PATIENT_NAME,
          AGE: row.AGE,
          MEDICINES: []
        }
      }
      acc[id].MEDICINES.push({
        MEDICINE: row.MEDICINE,
        FREQUENCY: row.FREQUENCY,
        DOSAGE: row.DOSAGE
      })

      return acc;

    }, {})

    res.status(200).json(Object.values(organize_result));


  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.post('/prscription/add', async (req, res) => {
  let conn;
  let result;
  let id_receive;
  let { DATE_P, ID_DOCTOR, ID_PATIENT, MEDICINES } = req.body;
  try {
    med_length = MEDICINES.length;
    conn = await oracledb.getConnection(oracledbConfig);

    const sql_prescription = `INSERT INTO PRESCRIPTION (DATE_P,ID_DOCTOR,ID_PATIENT) VALUES (TO_DATE(:date_p, 'YYYY-MM-DD'),:id_doctor,:id_patient) RETURNING ID INTO :id_receive`

    result = await conn.execute(sql_prescription, {
      date_p: DATE_P,
      id_doctor: ID_DOCTOR,
      id_patient: ID_PATIENT,
      id_receive: {
        type: oracledb.NUMBER,
        dir: oracledb.BIND_OUT
      }
    })
    const id_prescription = result.outBinds.id_receive[0];

    const sql_include = `INSERT INTO INCLUDE (ID_P_R,ID_MED,FREQ,DOSAGE) VALUES (:id_p_r,:id_med,:freq,:dosage)`

    for (const MED of MEDICINES) {
      result = await conn.execute(sql_include, {
        id_p_r: id_prescription,
        id_med: MED.ID_MED,
        freq: MED.FREQ,
        dosage: MED.DOSAGE
      })
    }

    await conn.commit();

    res.status(200).json({
      message: "PRESCRIPTION ADDING SUCESSFULLY 🟢",
    });

  } catch (err) {
    if (conn) await
      conn.rollback();
    res.status(500).send("🔴Server Error: " + err.message);


  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})

//****************** SALES PERSON *****************//
app.get('/sales/employees', async (req, res) => {

  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    const sql = `SELECT * FROM SALESPERSON`;
    let result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json(result.rows);

    result.rows.forEach(row => {
      console.log(row);
    });

  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);

  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.get('/sales/emoloyee/:id_salesPerson', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);

    let id_salesPerson = req.params.id_salesPerson;

    const sql = `SELECT * FROM SALESPERSON WHERE ID_SP = :id_salesPerson`;

    let result = await conn.execute(sql, [id_salesPerson], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "EMPLOYEE NOT FOUND 🔴"
      })
    }

    res.status(200).json(result.rows);


  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);

  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.post('/sales/add-employee', async (req, res) => {
  let conn;
  let { NAME, LANAME, ID_P } = req.body
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    const check_pharmacy_sql = `SELECT * FROM PHARMACY WHERE ID_P = :IDP`
    let result = await conn.execute(check_pharmacy_sql, [ID_P], { outFormat: oracledb.OUT_FORMAT_OBJECT })
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Pharmacy Not Found 🔴"
      })
    }

    const sql = `INSERT INTO SALESPERSON ( NAME , LANAME , ID_P) VALUES (:name ,: laname ,: id_p)`

    result = await conn.execute(sql, {
      name: NAME,
      laname: LANAME,
      id_p: ID_P
    },
      {
        autoCommit: true
      })

    res.status(200).json({
      message: "ADDING SALES EMPLOYEE SUCCESSFULLY 🟢"
    })
  } catch (err) {
    res.status(500).send("🔴 Server Error: " + err.message);
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.put('/sales/employee/upadate/:id_salesPerson', async (req, res) => {
  let conn;
  let { NAME, LANAME, ID_P } = req.body;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    const check_emp_sql = `select * from SALESPERSON WHERE ID_SP = :ID`
    const id_salesPerson = req.params.id_salesPerson;

    let result = await conn.execute(check_emp_sql, [id_salesPerson], { outFormat: oracledb.OUT_FORMAT_OBJECT })
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Sales Perosn Not Found 🔴"
      })
    }

    const sql = `UPDATE SALESPERSON SET 
          NAME= :name,
          LANAME= :laname, 
          ID_P = :id_p
            WHERE ID_SP = :id_salesPerson`

    result = await conn.execute(sql, {
      name: NAME,
      laname: LANAME,
      id_p: ID_P,
      id_salesPerson: id_salesPerson
    },
      {
        autoCommit: true
      });


    res.status(200).json({
      message: "SALES PEROSN UPDATE SUCCESSFULLY 🟢",
      rowsAffected: result.rowsAffected
    });


  } catch (err) {
    console.error("🔴 Error Updating SALES PERSON:" + err);
    res.status(500).send(err.message)
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.put('/sales/deliver/:id_prescription/:id_salesPerson', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    let { id_prescription, id_salesPerson } = req.params;

    const check_pres_sql = `SELECT STATUS FROM PRESCRIPTION WHERE ID =:id_prescription`
    let result = await conn.execute(check_pres_sql, [id_prescription], { outFormat: oracledb.OUT_FORMAT_OBJECT })

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "PRESCRIPTION NOT FOUND 🔴"
      })
    }
    if (result.rows[0].STATUS === 'DELIVERED') {
      return res.status(400).json({
        message: "THIS PRESCRIPTION HAS BEEN DELIVERED 🔴"
      })
    }
    const check_salesperson_sql = `SELECT * FROM SALESPERSON WHERE ID_SP = :id`
    result = await conn.execute(check_salesperson_sql, [id_salesPerson], { outFormat: oracledb.OUT_FORMAT_OBJECT })

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "THIS EMPLOYEE DOES NOT EXIST 🔴"
      })
    }
    const update_pres_sql = `UPDATE PRESCRIPTION
    SET ID_SP = :id_sp,
     STATUS = 'DELIVERED'
     WHERE ID = :id_prescription
      `
    result = await conn.execute(update_pres_sql, {
      id_prescription: id_prescription,
      id_sp: id_salesPerson
    })

    if (result.rowsAffected === 0) {
      throw new Error("Failed to update status 🔴")
    }

    const quantity_update_sql = `UPDATE MEDICINE M SET QUANTITY = QUANTITY - 1
    WHERE M.NAME IN (SELECT ID_MED FROM INCLUDE WHERE ID_P_R = :id_pres) AND QUANTITY > 0
    `

    result = await conn.execute(quantity_update_sql, {
      id_pres: id_prescription
    })

    if (result.rowsAffected === 0) {
      throw new Error("Failed to update stock 🔴")
    }


    await conn.commit();
    res.status(200).json({
      message: "PRESCRIPTION HAS BEEN DELIVERED AND SIGNED SUCCESSFULLY 🟢"
    })
  } catch (err) {
    if (conn) {
      await conn.rollback();
      return res.status(400).json({
        err: err.message
      })
    }
    res.status(500).json({
      error: err.message
    })
  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
//****************** PHARMACY *****************//
app.get('/pharmacy/details', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);


    const sql = `SELECT * FROM PHARMACY`

    let result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });


    res.status(200).json(result.rows);



  } catch (err) {
    res.status(500).send("🔴Server Error: " + err.message);

  } finally {
    if (conn) {
      try {
        conn.close();
        console.log("Connection close 🟢");
      } catch (err) {
        console.error("Somthing Wrong in disconnect 🔴 Error:" + err)
      }
    }
  }
})
app.get('/pharmacy/delivery-logs', async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(oracledbConfig);
    const sql = `SELECT 
    P.ID AS PRES_ID,
    S.NAME || ' ' || S.LANAME AS SALES_NAME,
    PH.NAME AS PHARMACY_NAME,
    PH.ADDRESS AS PH_LOCATION
      FROM PRESCRIPTION P
      JOIN SALESPERSON S ON P.ID_SP = S.ID_SP
      JOIN PHARMACY PH ON S.ID_P = PH.ID_P`;

    let result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("🔴 Error: " + err.message);
  } finally {
    if (conn) await conn.close();
  }
});









/*============================= End points ================================*/

