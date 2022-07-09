import './App.css';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';


function App() {
  const [activeComment, setActiveComment] = useState(true);
  const [activeBtn, setActiveBtn] = useState('active');
  const [comments, setComments] = useState(null);
  const [currentId, setCurrentId] = useState([]);
  const [showOrder, setShowOrder] = useState(false);
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    handleClose()
    setTimeout(() => {
      alert('Changes saved...')
    }, .5);
  }

  const handleButton = (buttonType) => {
    setActiveBtn(buttonType);
    buttonType === 'active' ? setActiveComment(true) : setActiveComment(false); 
  }

  const getComments = () => {
    fetch('https://jsonplaceholder.typicode.com/comments?postId=1')
      .then(response => response.json())
      .then(data => {setComments(data)})
  }

  useEffect(() => {
    getComments();
  }, [])

  const handleSelect = (checked, commentId) => {
    let updatedList = [...currentId];
    if(checked.checked) {
      updatedList = [...currentId, commentId]
      setShowOrder(true)
    } else {
      console.log('checked', currentId)
      updatedList.splice(currentId.indexOf(checked.value), 1);
    }

    setCurrentId(updatedList);
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const posts = reorder(
      currentId,
      result.source.index,
      result.destination.index
    );

    setCurrentId({ posts });
  }

  return (
    <div className="App">
      <header className="App-header">Manage Comments</header>

      <div className='commentType'>
        <Button 
          variant="outlined"
          name="active" 
          className={`${activeBtn === 'active' ? 'activeBtn' : undefined} btn`} 
          onClick={(e) => handleButton(e.target.name)}
        >
          Active Comments
        </Button>
        <Button 
          variant="outlined" 
          name="delete"
          className={`${activeBtn === 'delete' ? 'activeBtn' : undefined} btn`} 
          onClick={(e) => handleButton(e.target.name)}
        >
          Deleted Comments
        </Button>
      </div>

      {comments?.length > 1 ? 
        <div className='commentsContainer'>
          {activeComment ? 
            <div className='singleComment'>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Post 1</Typography>
                  </AccordionSummary>
                    <AccordionDetails className='details'>
                      <div className='col1'>
                        <div className='col1__Header'>
                          <h3>Comments</h3>
                          <div>
                            <SearchIcon className='icon' />
                            <input type="text" placeholder="Search"/>
                          </div>
                        </div>
                        <div className='col1__Body'>
                          <div className='col1__BodyTop'>
                            <h4>Name</h4>
                            <h4>Comment</h4>
                          </div>
                          <div className='col1__BodyBottom'>
                          {comments.map(comment => (
                            <div className='col1__BodyBottom__Item'>
                              <h4>{comment.name.substring(0, 35)}{comment.name.length > 35 ? '...' : ''}</h4>
                              <div>
                                <p>{comment.body.substring(0, 25)}{comment.body.length > 25 ? '...' : ''}</p>
                                <Checkbox 
                                  color='success' 
                                  className='icon'
                                  onChange={(e) => handleSelect(e.target, comment)}
                                />
                              </div>
                            </div>
                          ))}
                          </div>
                        </div>
                      </div>
                      {showOrder && 
                        <div className='col1'>
                          <div className='col1__Header'>
                            <h3>Set Order</h3>
                          </div>
                          
                          <div className='setOrderContainer'>
                            <DragDropContext onDragEnd={onDragEnd}>
                              <Droppable droppableId='list'>
                                {(provided, snapshot) => ( 
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                  >
                                    {currentId?.map((item, index) => (
                                      <Draggable draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            <div className='setOrderItem'>
                                            <DragIndicatorIcon className='icon' />
                                            <EditIcon className='icon' onClick={handleOpen}/>
                                            <p>{item.body.substring(0, 45)}...</p>
                                            <Checkbox color='success' checked/>
                                            </div>

                                            <Modal
                                              open={open}
                                              onClose={handleClose}
                                              aria-labelledby="child-modal-title"
                                              aria-describedby="child-modal-description"
                                            >
                                              <Box sx={{ ...style, width: 400 }}>
                                                <h2 id="child-modal-title">Edit Comment</h2>
                                                <input 
                                                  style={{width: '100%', padding: '.5rem', margin: '1rem 0'}} 
                                                  id="child-modal-description" 
                                                  value={item.body} 
                                                  onChange={e => setDesc(e.target.value)}
                                                /> <br />                                               
                                                <Button onClick={handleClose}>Cancel</Button>
                                                <Button onClick={handleSave}>Save</Button>
                                              </Box>
                                            </Modal>
                                            <Button style={{position: 'absolute', top: '1rem', right: '4rem'}} onClick={handleSave}>Save Changes</Button>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                  </div>
                                )}
                              </Droppable>
                            </DragDropContext>
                          </div>
                        </div>
                      }
                    </AccordionDetails>
                </Accordion>
            </div>
            :
            <h1>Deleted Comments</h1>
          }
        </div>
        :
        <h3 style={{textAlign: 'center', marginTop: '2rem'}}>Loading...</h3>
      }
    </div>
  );
}

export default App;


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '0',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};