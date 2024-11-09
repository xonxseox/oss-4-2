import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const apiBaseUrl = "https://672e398e229a881691ef646a.mockapi.io/Fruits";
  const [fruits, setFruits] = useState([]);
  const [modalType, setModalType] = useState('add');
  const [selectedFruit, setSelectedFruit] = useState({ id: '', name: '', color: '', pricePerKg: '', origin: '' });
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    getDataFromJSONFile();
  }, []);

  const getDataFromJSONFile = () => {
    fetch(apiBaseUrl)
      .then(response => response.json())
      .then(data => setFruits(data));
  };

  const openAddModal = () => {
    setSelectedFruit({ id: '', name: '', color: '', pricePerKg: '', origin: '' });
    setModalType('add');
    window.$('#fruitModal').modal('show');
  };

  const openUpdateModal = async () => {
    const id = prompt("수정할 과일의 ID를 입력하세요:");
    if (!id) return;
    try {
      const response = await fetch(`${apiBaseUrl}/${id}`);
      const fruit = await response.json();
      setSelectedFruit({ ...fruit });
      setModalType('update');
      window.$('#fruitModal').modal('show');
    } catch (error) {
      alert('과일을 불러오는 데 실패했습니다.');
    }
  };

  const openDeleteModal = () => {
    setDeleteId('');
    window.$('#deleteModal').modal('show');
  };

  const handleCreateOrUpdate = () => {
    if (modalType === 'add') {
      createDataToJSONFile();
    } else {
      updateDataToJSONFile(selectedFruit.id);
    }
  };

  const createDataToJSONFile = () => {
    fetch(apiBaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedFruit),
    })
      .then(response => response.json())
      .then(() => {
        alert('과일이 추가되었습니다!');
        window.$('#fruitModal').modal('hide');
        getDataFromJSONFile();
      });
  };

  const updateDataToJSONFile = (id) => {
    fetch(`${apiBaseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedFruit),
    })
      .then(response => response.json())
      .then(() => {
        alert('과일 정보가 수정되었습니다!');
        window.$('#fruitModal').modal('hide');
        getDataFromJSONFile();
      });
  };

  const deleteDataFromJSONFile = () => {
    if (!deleteId) {
      alert("삭제할 과일 ID를 입력하세요!");
      return;
    }
    fetch(`${apiBaseUrl}/${deleteId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        alert('과일이 삭제되었습니다!');
        window.$('#deleteModal').modal('hide');
        getDataFromJSONFile();
      })
      .catch(() => alert('삭제 실패! 오류 발생.'));
  };

  return (
    <div className="container">
      <h1>과일 관리 시스템</h1>
      <button className="btn btn-primary" onClick={getDataFromJSONFile}>과일 목록 보기</button>
      <div>
        <button className="btn btn-primary" onClick={openAddModal}>과일 추가</button>
        <button className="btn btn-secondary" onClick={openUpdateModal}>과일 수정</button>
        <button className="btn btn-danger" onClick={openDeleteModal}>과일 삭제</button>
      </div>
      <div id="div_fruits">
        {fruits.map((fruit) => (
          <div key={fruit.id}>ID: {fruit.id}, 이름: {fruit.name}, 색상: {fruit.color}, 가격: {fruit.pricePerKg}원, 원산지: {fruit.origin}</div>
        ))}
      </div>

      {/* 데이터 추가 및 수정용 모달 */}
      <div className="modal fade" id="fruitModal" tabIndex="-1" aria-labelledby="fruitModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="fruitModalLabel">과일 {modalType === 'add' ? '추가' : '수정'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              이름: <input type="text" value={selectedFruit.name} onChange={(e) => setSelectedFruit({ ...selectedFruit, name: e.target.value })} className="form-control" placeholder="과일 이름 입력" />
              색상: <input type="text" value={selectedFruit.color} onChange={(e) => setSelectedFruit({ ...selectedFruit, color: e.target.value })} className="form-control" placeholder="색상 입력" />
              가격(kg당): <input type="number" value={selectedFruit.pricePerKg} onChange={(e) => setSelectedFruit({ ...selectedFruit, pricePerKg: e.target.value })} className="form-control" placeholder="가격 입력" />
              원산지: <input type="text" value={selectedFruit.origin} onChange={(e) => setSelectedFruit({ ...selectedFruit, origin: e.target.value })} className="form-control" placeholder="원산지 입력" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
              <button type="button" className="btn btn-primary" onClick={handleCreateOrUpdate}>과일 {modalType === 'add' ? '추가' : '수정'}</button>
            </div>
          </div>
        </div>
      </div>

      {/* 삭제용 모달 */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">과일 삭제</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              삭제할 과일 ID: <input type="number" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} className="form-control" placeholder="ID 입력" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
              <button type="button" className="btn btn-danger" onClick={deleteDataFromJSONFile}>삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
