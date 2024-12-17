import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { FaAward, FaCheck, FaCrown, FaSpinner } from 'react-icons/fa';

interface TaskCardProps {
  task: {
    id: string;
    icon: JSX.Element | string;
    title: string;
    reward: number | string;
    status?: JSX.Element | string;
    bg?: string;
    bottom?: string;
    onClick?: () => void;
    path?: string;
    gradient?: string;
    img?: boolean;
  };
  taskLoading?: boolean;
  completedTasks: Record<string, boolean>;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, completedTasks, taskLoading }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    // Set the target time to midnight of the next day
    const targetTime = new Date();
    targetTime.setHours(24, 0, 0, 0);  // Set to midnight of the next day

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetTime.getTime() - now;

      if (difference <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");

        setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initialize countdown immediately

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [task.id]); // Make sure effect runs when task.id changes

  return (
    <Card className="flex justify-between items-center border-0">
      <div className="flex gap-2 items-center">
        <Avatar>
          {
            typeof task.icon === "string" ? (!task.img ?
              <>
                <AvatarImage src={`https://github.com/${task.icon}.png`} />
                <AvatarFallback>
                  <FaAward />
                </AvatarFallback>
              </>
              :
              <>
                <AvatarImage className={`${task.bg}`} src={`https://res.cloudinary.com/duscymcfc/image/upload/v1731678253/paws/${task.icon}.png`} />
                <AvatarFallback>
                  <FaAward />
                </AvatarFallback>
              </>
            ) :
              <div className={`flex justify-center items-center w-full ${task.bg}`}>
                {task.icon}
              </div>
          }
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg capitalize">{task.title}</h3>
          <p className="text-sm text-muted-foreground">
            {
              typeof task.reward === "string" ? task.reward :
                <>
                  {(task.reward).toLocaleString() || 0} PERKS
                </>
            }
          </p>
        </div>
      </div>
      {completedTasks[task.id] ? 
          typeof task.reward === "string" ? <FaCrown size={18} className="mr-4" /> :
        <FaCheck size={18} className="mr-4" />
       : task.status === "0/1" ? (
        <div className="flex items-end flex-col gap-1">
          <div className="text-sm bg-foreground/10 p-1 px-2 rounded-full font-bold">0/1</div>
          <div className="text-xs">{timeLeft}</div>
        </div>
      ) : task.status === "calculating" ? (
        <div className="flex  items-end flex-col gap-1">
          <div className="text-sm font-semibold">Calculating</div>
          <div className="text-xs">{timeLeft}</div>
        </div>
      ) : (
        <Button
          onClick={task.onClick}
          className="rounded-full text-[.65rem] h-7 font-semibold"
          disabled={taskLoading}
        >
          {taskLoading ? <FaSpinner className="animate-spin" size={16} /> : "Start"}
        </Button>
      )}
    </Card>
  );
};

export default TaskCard;
